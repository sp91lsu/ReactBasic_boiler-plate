import {projectList} from "./data/apps/project-list.js";
import {auth} from "../middleware/auth.js";

export default function AppsController (app) {
    app.get('/api/apps/project-list', auth, (req, res) =>{
        return res.status(200).json(projectList)
    })
}