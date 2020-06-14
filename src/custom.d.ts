import { Blip } from "./util/radarData";

declare module "radar.yaml" {
  const content: Blip[];
  export default content;
}