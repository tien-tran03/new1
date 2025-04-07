import { CreatePageForm} from "../../components/";

export const CreateNewPage = () => {
    return <CreatePageForm 
    onClose={() => {console.log("Form closed")}}/>
};
