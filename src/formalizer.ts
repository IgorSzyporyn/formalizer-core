import { XtypeMapModel } from "./models";
import { getXtypeMap } from "./utils";

export interface formalizer {
  xtypeMap: XtypeMapModel;
}

export class formalizer {
  constructor() {
    this.xtypeMap = this.xtypes;
  }

  xtypeMap: XtypeMapModel = {};

  private xtypes: XtypeMapModel = getXtypeMap();
}
