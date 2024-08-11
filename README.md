# Requirements

## I. Implement CRUD REST APIs for devices
### Create Device
- Input: `Device: {name, status}`
- Output: `Device: {id, name, status}` id should be generated during creating device in `uuid v4` format (use `uuid` package to be imported)
### List Device
- Input: ``
- Output: Return a list of all devices
### Get Device
- Input: Device identifier
- Output: Found device
### Update Device
- Input: Device identifier, information to update
- Output: Updated Device
### Delete Device
- Input: Device identifier
- Output: Optional
## II. Cover implementation by unit test as much as possible

- Classify HTTP errors by classes to be used in controllers (to get rid of using response.writeHead anytime)
- Find the way to optimize the router (to remove the Switch Case statement) (how to configure the http path and method in an efficient way for routing the request to the correct controller)
- Document all implemented APIs by OpenAPI 3.0 which can be visualized by swagger (https://editor.swagger.io/)