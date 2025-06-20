import type { RandomId } from "../../../app/driven-ports/random-id.js";
import { v4 as uuidv4 } from "uuid";

type GetRandomIdUuid = () => RandomId;

const getRandomIdUuid: GetRandomIdUuid = () => {
  return {
    generate: () => uuidv4(),
  };
};

export { getRandomIdUuid };
