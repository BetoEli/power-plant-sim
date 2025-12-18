Swagger UI
Nuclear Power Plant Simulator API
1.1.0
OAS3
A RESTful API designed to support virtual nuclear power plants.

Authorize
Reactors

GET
/reactors
This method will provide you with generic information about your power plant.

Parameters
Try it out
No parameters

Responses
Code Description Links
200
This is returned when the operation was successful.

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"reactors": [
{
"id": "string",
"name": "string"
}
],
"plant_name": "string"
}
No links

GET
/reactors/temperature/{id}
This method will provide you with temperature information for a particular reactor.

Parameters
Try it out
Name Description
id \*
string
(path)
The ID of the reactor you wish to access.

id
Responses
Code Description Links
200
This is returned when the request was successful.

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"temperature": {
"amount": 0,
"unit": "fahrenheit",
"status": "string"
}
}
No links
404
This is returned when a reactor with the requested ID could not be found.

No links

GET
/reactors/coolant/{id}
This method will provide you with coolant information for a particular reactor.

Parameters
Try it out
Name Description
id \*
string
(path)
The ID of the reactor you wish to access.

id
Responses
Code Description Links
200
This is returned when the request was successful.

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"coolant": "on"
}
No links

POST
/reactors/coolant/{id}
This method allows you to change the coolant state for a particular power plant.

Parameters
Try it out
Name Description
id \*
string
(path)
The ID of the reactor you wish to access.

id
Request body

application/json
Example Value
Schema
{
"coolant": "on"
}
Responses
Code Description Links
201
This is returned when the request was successful.

No links
400
This is returned when the request doesn't contain the necessary information to update the Reactor's coolant state.

No links

GET
/reactors/output/{id}
This method provides power output information for a particular reactor.

Parameters
Try it out
Name Description
id \*
string
(path)
The ID of the reactor you wish to access.

id
Responses
Code Description Links
200
This is returned when the request was successful.

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"output": {
"amount": 0,
"unit": "Megawatt (MW)"
}
}
No links

POST
/reactors/temperature
This method allows you to change the temperature unit your reactors.

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
"unit": "fahrenheit"
}
Responses
Code Description Links
201
This is returned when the request was successful.

No links

GET
/reactors/logs
This method allows you to get the logs for all of your reactors.

Parameters
Try it out
No parameters

Responses
Code Description Links
200
This is returned when the request was successful. It is important to note here that dynamic_id refers to a real reactor id.

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"dynamic_id": [
"string"
]
}
No links

GET
/reactors/fuel-level/{id}
This method allows you to get the fuel level for a particular reactor.

Parameters
Try it out
Name Description
id \*
string
(path)
The ID of the reactor you wish to access.

id
Responses
Code Description Links
200
This is returned when the request was successful.

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"fuel": {
"percentage": 0
}
}
No links

GET
/reactors/reactor-state/{id}
This method allows you to get the state a particular reactor.

Parameters
Try it out
Name Description
id \*
string
(path)
The ID of the reactor you wish to access.

id
Responses
Code Description Links
200
This is returned when the request was successful.

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"state": "string"
}
No links

GET
/reactors/rod-state/{id}
This method allows you to get the rod state for a particular reactor.

Parameters
Try it out
Name Description
id \*
string
(path)
The ID of the reactor you wish to access.

id
Responses
Code Description Links
200
This is returned when the request was successful.

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"control_rods": {
"in": 180,
"out": 120
}
}
No links

PUT
/reactors/set-reactor-name/{id}
This method allows you to set the name for a particular reactor.

Parameters
Try it out
Name Description
id \*
string
(path)
The ID of the reactor you wish to access.

id
Request body

application/json
Example Value
Schema
{
"name": "My Reactor"
}
Responses
Code Description Links
200
This is returned when the request was successful.

No links
400
This is returned when the request doesn't contain the necessary information to update the Reactor's name.

No links

POST
/reactors/drop-rod/{id}
This method allows you to drop a rod for a particular reactor.

Parameters
Try it out
Name Description
id \*
string
(path)
The ID of the reactor you wish to access.

id
Responses
Code Description Links
201
This is returned when the request was successful.

No links
400
This is returned when the request doesn't contain the necessary information to drop a Reactor's rod.

No links

POST
/reactors/raise-rod/{id}
This method allows you to raise a rod for a particular reactor.

Parameters
Try it out
Name Description
id \*
string
(path)
The ID of the reactor you wish to access.

id
Responses
Code Description Links
201
This is returned when the request was successful.

No links
400
This is returned when the request doesn't contain the necessary information to raise a Reactor's rod.

No links

POST
/reactors/emergency-shutdown/{id}
This method allows you to force a particular reactor into an emergency shutdown.

Parameters
Try it out
Name Description
id \*
string
(path)
The ID of the reactor you wish to access.

id
Responses
Code Description Links
201
This is returned when the request was successful.

No links
400
This is returned when the request doesn't contain the necessary information to force the Reactor into an emergency shutdown.

No links

POST
/reactors/controlled-shutdown/{id}
This method allows you to force a particular reactor into a controlled shutdown.

Parameters
Try it out
Name Description
id \*
string
(path)
The ID of the reactor you wish to access.

id
Responses
Code Description Links
201
This is returned when the request was successful.

No links
400
This is returned when the request doesn't contain the necessary information to force a Reactor into a controlled shutdown.

No links

POST
/reactors/maintenance/{id}
This method allows you to force a particular reactor into maintenance mode.

Parameters
Try it out
Name Description
id \*
string
(path)
The ID of the reactor you wish to access.

id
Responses
Code Description Links
201
This is returned when the request was successful.

No links
400
This is returned when the request doesn't contain the necessary information to put the Reactor into Maintenance Mode.

No links

POST
/reactors/refuel/{id}
This method allows you to refuel a particular reactor.

Parameters
Try it out
Name Description
id \*
string
(path)
The ID of the reactor you wish to access.

id
Responses
Code Description Links
201
This is returned when the request was successful.

No links
400
This is returned when the request doesn't contain the necessary information to refuel the Reactor.

No links

POST
/reactors/reset
This method allows you to reset all of your reactors.

Parameters
Try it out
No parameters

Responses
Code Description Links
201
This is returned when the request was successful.

No links

POST
/reactors/start-reactor/{id}
This method allows you to start a particular reactor.

Parameters
Try it out
Name Description
id \*
string
(path)
The ID of the reactor you wish to access.

id
Responses
Code Description Links
201
This is returned when the request was successful.

No links
400
This is returned when the request doesn't contain the necessary information to start the Reactor.

No links

PUT
/reactors/plant-name
This method allows you to change the name of your power plant.

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
"name": "My Nuclear Power Plant"
}
Responses
Code Description Links
200
This is returned when the request was handled successfully.

No links
400
This is returned when the request doesn't contain the necessary information to update the simulator's Nuclear Plant name.

No links

Schemas
GlobalData{
id* [...]
name* [...]
}
PlantData{
reactors* [...]
plant_name* [...]
}
TemperatureInternal{
amount* [...]
unit* [...]
status* [...]
}
TemperatureDto{
temperature* TemperatureInternal{...}
}
CoolantDataDto{
coolant* [...]
}
OutputInternal{
amount* [...]
unit* [...]
}
OutputDto{
output* OutputInternal{...}
}
UpdateReactorTemperatureUnitDto{
unit* [...]
}
LogsDto{
dynamic_id* [...]
}
FuelInternal{
percentage* [...]
}
FuelDto{
fuel* FuelInternal{...}
}
ReactorStateDto{
state* [...]
}
RodDataInternal{
in* [...]
out* [...]
}
RodData{
control_rods* {...}
}
UpdateReactorNameDto{
name* [...]
}
UpdateReactorCoolant{
coolant* [...]
}
UpdatePlantName{
name\* [...]
}
