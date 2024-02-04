# Available Permissions Javascript Extractor script

This is a DevOps script that can be used to extract available permissions from `.html`, `.js`, and `.ts` files 
in the current directory recursively.

Permissions in files are expected to be in the following format:

```javascript
var somePermission = {
    id: 'unique-id-here-123abc',
    name: 'Super Feature',
    description: 'This is a super feature',
    category: 'My Cool Features',
    parentCategory: ''
};
```

The `extract-available-permissions-test-file.ts` contains an example permission. 

Permissions can also be embedded in `html` attributes (thought not recommended) as shown below and they will be 
extracted by this script as well. 

```html
<div app-permission="{ 'id': 'unique-id-here-123abc', 'name': 'Cool Feature A', 'description': 'This is a cool feature A', 'category': 'My Cool Features' }">
    Some securable content
</div>
```

Permissions extracted from files will be placed into the `available-permissions.json` file. Repeat executions 
of the file will catch updates if the identifier remains the same. Otherwise, if there is an identifier that 
does not exist in the `available-permissions.json` then it will create a new permission for it. Once an identifier
is used for a permission, do not repeat it for another permission. Also, once a permission is added, do not 
remove it unless the script is run from scratch each time (recommended practice in cd pipeline).

## Test the Script 

Open PowerShell and run

  `PS c:\somewhere> node .\extract-available-permissions.js`

It will pull permissions out of the following files

```
  extract-available-permissions-test-file.html
  extract-available-permissions-test-file.ts
```

And put them into this file

  `available-permissions.json`

In this case, the permissions in the test files will end up in the output file above like this:

```json
[
  {
    "id": "C989BFF5-5833-4451-B2EF-47D442F7AD61",
    "name": "Super Feature",
    "description": "This is a super feature",
    "category": "My Cool Features",
    "parentCategory": ""
  },
  {
    "id": "A106CF9A-285F-4CA5-B982-63DD1C6539F7",
    "name": "Cool Feature A",
    "description": "This is a cool feature A",
    "category": "My Cool Features"
  },
  {
    "id": "8753DB3C-96AB-424D-9CFF-013C7CCDDBF1",
    "name": "Another Cool Feature X",
    "description": "This is another cool feature X",
    "category": "My Cool Features"
  }
]
```

Enjoy!
