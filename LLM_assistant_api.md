# LLM-assistant API

## class LLM_assistant
LLM_assistant(model_path_or_repo_id, model_file)
- model_path_or_repo_id (string): model path or repo ID of the LLM to use (e.g. TheBloke/Llama-2-7B-Chat-GGUF)
- model_file (string): which specific model file to use (e.g. llama-2-7b-chat.Q5_K_M.gguf)

## Public methods of the class LLM_assistant:
  
### 1) method suggest

suggest(entity_name, entity_name2, user_choice, count_items_to_suggest, conceptual_model, domain_description)

- entity_name (string): name of the entity for which `LLM_assistant` suggests items based on the `user_choice`
- entity_name2 (string, optional): name of the second entity if the user wants to suggest relationships in between two entities
- user_choice (enum): one of these 3 options of what user wants to suggest: ATTRIBUTES for attributes, RELATIONSHIPS_ENTITIES for relationships with new possible entites, RELATIONSHIPS for relationships in between two entities
- count_items_to_suggest (int): how many items should be suggested, must be greater than 0
- conceptual_model (JSON object describing conceptual model, optional): selected part of the conceptual model by user
- domain_description (string, optional): description of the domain the user is modeling
- returns new suggested items based on the `user_choice` for the entity `entity_name` and optionally the entity `entity_name2`
	- with the length of `count_items_to_suggest`
	- solely based on the `domain_description` and the context of `conceptual_model` if provided else the output is based on the learned parameters of the selected LLM
	- output is in JSON array:
	 	- with properties `attribute` if `user_choice` == ATTRIBUTES
		- with properties `relationship`, `new_entity_name` if `user_choice` == RELATIONSHIPS_ENTITIES
		- with properties `relationship` if `user_choice` == RELATIONSHIPS

  
### 2) method summarize_conceptual_model

summarize_conceptual_model(conceptual_model)

- conceptual_model (JSON object describing conceptual model): whole user's conceptual model or some part of it
- returns (string): description of the selected conceptual model `conceptual_model_selected`

  
    
### 3) method highlight_modeled_part

highlight_modeled_domain_description(domain_text_description, conceptual_model)

- `domain_description` (string): description of the domain the user is modeling
- conceptual_model (JSON object describing conceptual model): whole user's conceptual model or some part of it
- returns (string): the part of the text from the `domain_description` which is represented in the selected conceptul model `conceptual_model_selected`



#### JSON object describing the conceptual model:

{
	"entity_name_1":
	{
		"attributes": ["name": ...],
	  	"relationships": ["name": ..., "source_entity": ..., "target_entity": ..., "cardinality": ... "attributes": ["name": ..., ...]]
		"parent_entity": ...
	},
	"entity_name_2":
	{
		...
	},
	...
}

### Notes
- in JSON object "parent_entity" is used for representing the ISA-hierarchy
- for possible future extension every method can have an additional argument `user_instruction` allowing user to specify his request more specifically

### TODO:
- in the method `suggest` how should the output look like?
- in the method `suggest` do we want to let user choose `count_items_to_suggest`?