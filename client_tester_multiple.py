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

    entities = {
        ATTRIBUTES_STRING: ["course", "professor", "dormitory", "student"],
        RELATIONSHIPS_STRING: ["course", "professor", "dormitory", "student"],
        RELATIONSHIPS_STRING_TWO_ENTITIES: [("course", "professor"), ("professor", "student"), ("student", "dormitory")]
        }


    domain_descriptions = ["", "We know that courses have a name and a specific number of credits. Each course can have one or more professors, who have a name. Professors could participate in any number of courses. For a course to exist, it must aggregate, at least, five students, where each student has a name. Students can be enrolled in any number of courses. Finally, students can be accommodated in dormitories, where each dormitory can have from one to four students. Besides, each dormitory has a price."]
    user_choices = [ATTRIBUTES_STRING, RELATIONSHIPS_STRING, RELATIONSHIPS_STRING_TWO_ENTITIES]

    file_name = f"output/{time.strftime('%Y-%m-%d-%H-%M-%S')}.txt"

    if (IS_SAVE_TO_FILE):
        with open(file_name, 'w') as file:
            file.write(f"Take only relevant info from domain description: {str(TAKE_ONLY_RELEVANT_INFO_FROM_DOMAIN_DESCRIPTION)}\n\n")

    for user_choice in user_choices:
        for domain_description in domain_descriptions:
            for entity in entities[user_choice]:

                entity_2 = ""
                if user_choice == RELATIONSHIPS_STRING_TWO_ENTITIES:
                    entity_2 = entity[1]
                    entity = entity[0]

                items = llm_assistant.suggest(entity, entity_2, user_choice, ITEMS_COUNT, conceptual_model=[], domain_description=domain_description)
                
                if (IS_SAVE_TO_FILE):
                    with open(file_name, 'a') as file:
                        #for item in items:
                        for i in range(len(items)):
                            if i == 0:
                                item = str(items[0]).replace('\\n', '\n') + '\n'
                            else:
                                item = str(items[i])
                            file.write(item + '\n')
                        
                        file.write("\n\n")


if __name__ == "__main__":
    main()