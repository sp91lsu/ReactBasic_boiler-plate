import {mongoURI_Prod} from "./prod.js";
import {mongoURI_Dev} from "./dev.js";

let mongoURI_ = ''
if (process.env.NODE_ENV === "production") {
    mongoURI_ = mongoURI_Prod
} else {
    mongoURI_ = mongoURI_Dev
}

export const mongoURI = mongoURI_;
