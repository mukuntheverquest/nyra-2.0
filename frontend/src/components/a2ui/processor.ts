export interface A2UIComponent {
  id: string;
  component: string;
  [key: string]: any;
}

export interface CreateSurfacePayload {
  surfaceId: string;
  catalogId: string;
  sendDataModel?: boolean;
}

export interface UpdateComponentsPayload {
  surfaceId: string;
  components: A2UIComponent[];
}

export interface UpdateDataModelPayload {
  surfaceId: string;
  path: string;
  value: any;
}

export interface DeleteSurfacePayload {
  surfaceId: string;
}

export interface A2UIMessage {
  version: string;
  createSurface?: CreateSurfacePayload;
  updateComponents?: UpdateComponentsPayload;
  updateDataModel?: UpdateDataModelPayload;
  deleteSurface?: DeleteSurfacePayload;
}

export interface SurfaceState {
  surfaceId: string;
  catalogId: string;
  componentsById: Map<string, A2UIComponent>;
  dataModel: Record<string, any>;
  rawMessages: A2UIMessage[];
}

/**
 * Resolves a dynamic field binding against the current data model.
 * If value is an object with { path: "/pointer" }, resolves using JSON Pointer.
 * Otherwise returns the literal value.
 */
export function resolveDynamicValue(bindingOrLiteral: any, dataModel: Record<string, any>): any {
  if (bindingOrLiteral === null || bindingOrLiteral === undefined) {
    return "";
  }
  if (typeof bindingOrLiteral === "object" && bindingOrLiteral.path) {
    const pointer = bindingOrLiteral.path as string;
    if (pointer === "/" || pointer === "") return dataModel;
    const segments = pointer.replace(/^\//, "").split("/");
    let current = dataModel;
    for (const seg of segments) {
      if (current === undefined || current === null) return "";
      current = current[seg];
    }
    return current !== undefined ? current : "";
  }
  return bindingOrLiteral;
}

/**
 * Mutates an in-memory data model using a JSON Pointer path.
 */
export function applyDataModelUpdate(target: Record<string, any>, path: string, value: any): Record<string, any> {
  if (path === "/" || path === "") {
    if (typeof value === "object" && value !== null) {
      return { ...target, ...value };
    }
    return value;
  }
  const segments = path.replace(/^\//, "").split("/");
  const updated = { ...target };
  let current: any = updated;
  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i];
    if (!(seg in current) || typeof current[seg] !== "object") {
      current[seg] = {};
    }
    current = current[seg];
  }
  current[segments[segments.length - 1]] = value;
  return updated;
}

/**
 * Client-side A2UI v1.0 message processor and surface state manager.
 */
export class A2UIMessageProcessor {
  private surfaces: Map<string, SurfaceState> = new Map();

  public processMessages(messages: A2UIMessage[]): void {
    if (!Array.isArray(messages)) return;

    for (const msg of messages) {
      if (msg.createSurface) {
        const { surfaceId, catalogId } = msg.createSurface;
        const existing = this.surfaces.get(surfaceId);
        this.surfaces.set(surfaceId, {
          surfaceId,
          catalogId,
          componentsById: existing ? existing.componentsById : new Map(),
          dataModel: existing ? existing.dataModel : {},
          rawMessages: existing ? [...existing.rawMessages, msg] : [msg],
        });
      } else if (msg.updateComponents) {
        const { surfaceId, components } = msg.updateComponents;
        let surface = this.surfaces.get(surfaceId);
        if (!surface) {
          surface = {
            surfaceId,
            catalogId: "nyra.ffe.mobile.v1",
            componentsById: new Map(),
            dataModel: {},
            rawMessages: [],
          };
          this.surfaces.set(surfaceId, surface);
        }
        for (const comp of components) {
          surface.componentsById.set(comp.id, comp);
        }
        surface.rawMessages.push(msg);
      } else if (msg.updateDataModel) {
        const { surfaceId, path, value } = msg.updateDataModel;
        let surface = this.surfaces.get(surfaceId);
        if (!surface) {
          surface = {
            surfaceId,
            catalogId: "nyra.ffe.mobile.v1",
            componentsById: new Map(),
            dataModel: {},
            rawMessages: [],
          };
          this.surfaces.set(surfaceId, surface);
        }
        surface.dataModel = applyDataModelUpdate(surface.dataModel, path, value);
        surface.rawMessages.push(msg);
      } else if (msg.deleteSurface) {
        this.surfaces.delete(msg.deleteSurface.surfaceId);
      }
    }
  }

  public getSurface(surfaceId: string): SurfaceState | undefined {
    return this.surfaces.get(surfaceId);
  }

  public getAllSurfaces(): SurfaceState[] {
    return Array.from(this.surfaces.values());
  }

  public clear(): void {
    this.surfaces.clear();
  }
}
