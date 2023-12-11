from LLM_assistant import LLMAssistant, ITEMS_COUNT, ATTRIBUTES_STRING, RELATIONSHIPS_STRING, RELATIONSHIPS_STRING_TWO_ENTITIES, TAKE_ONLY_RELEVANT_INFO_FROM_DOMAIN_DESCRIPTION
import time
import json

IS_SAVE_TO_FILE = True

def main():

    # Define the model
    model_path_or_repo_id = "TheBloke/Llama-2-7B-Chat-GGUF"
    model_file = "llama-2-7b-chat.Q5_K_M.gguf"
    model_type = "llama"

    llm_assistant = LLMAssistant(model_path_or_repo_id=model_path_or_repo_id, model_file=model_file, model_type=model_type)

    entities = ["vehicle", "student", "gpu", "employee", "earth", "zoo", "amusement park", "thing"]
    user_choices = [ATTRIBUTES_STRING, RELATIONSHIPS_STRING, RELATIONSHIPS_STRING_TWO_ENTITIES]

    file_name = f"output/{time.strftime('%Y-%m-%d-%H-%M-%S')}.txt"
    if (IS_SAVE_TO_FILE):
        with open(file_name, 'w') as file:
            file.write(f"Take only relevant info from domain description: {str(TAKE_ONLY_RELEVANT_INFO_FROM_DOMAIN_DESCRIPTION)}\n\n")


    for entity in entities:
        time_start = time.time()

        domain_description = "We know that courses have a name and a specific number of credits. Each course can have one or more professors, who have a name. Professors could participate in any number of courses. For a course to exist, it must aggregate, at least, five students, where each student has a name. Students can be enrolled in any number of courses. Finally, students can be accommodated in dormitories, where each dormitory can have from one to four students. Besides, each dormitory has a price."
        items = llm_assistant.suggest(entity, "", ATTRIBUTES_STRING, ITEMS_COUNT, conceptual_model=[], domain_description=domain_description)

        time_end = time.time()
        print(f"\nTime: {time_end - time_start:.2f} seconds")
        
        if (IS_SAVE_TO_FILE):
            with open(file_name, 'a') as file:
                for item in items:
                    #json.dump(item, file)
                    file.write(str(item) + '\n')
                
                file.write("\n\n")


if __name__ == "__main__":
    main()