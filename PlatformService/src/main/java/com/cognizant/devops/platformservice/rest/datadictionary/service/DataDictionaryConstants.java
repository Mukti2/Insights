/*******************************************************************************
 * Copyright 2017 Cognizant Technology Solutions
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.  You may obtain a copy
 * of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/

package com.cognizant.devops.platformservice.rest.datadictionary.service;

public interface DataDictionaryConstants {

	String GET_TOOL_PROPERTIES_QUERY = "MATCH(n:__CategoryName__:__ToolName__:DATA) return keys(n) order by n.inSightsTime desc limit 1";
	String GET_TOOLS_RELATIONSHIP_QUERY = "MATCH (n:__StartToolCategory__:__StartToolName__)-[r]->"
			+ "(m:__EndToolCategory__:__EndToolName__) return type(r),r LIMIT 1";
	String UUID = "uuid";
	String EXEC_ID = "execId";
}
