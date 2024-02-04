const dir = require('node-dir');
const fs = require('fs');

var sourceDir = '.';
var outputFile = 'available-permissions.json';
const regEx = /permission[\s\S]*?=[\s\"]*?({[\s]*[\S]*[:][\s]*['\"][\S]+['\"][\s\S]*?})/gi;

fs.access(outputFile, error => {
    if (error) {
        fs.writeFileSync(outputFile, '[]');
    } 
});

var fileProcessor = function(err, files) {

    if(err) {
        console.log(`Error: ${err}`);
        return;
    }

    var outputFileData = fs.readFileSync(outputFile, {encoding:'utf8', flag:'r'});

    if(!outputFileData) {
        outputFileData = JSON.stringify([]);
    }

    var permissions = JSON.parse(outputFileData);

    files
        .filter(f => !f.includes('node_modules') && (f.endsWith('.html') || f.endsWith('.js') || f.endsWith('.ts')))
        .forEach(file => { 
        
            var fileData = fs.readFileSync(file, {encoding:'utf8', flag:'r'});

            do {
                var regExResult = regEx.exec(fileData);

                if(regExResult != null) {

                    var permission = JSON.parse(
                        regExResult[1]
                            .replace(/'/g, "\"")
                            .replace(/id:/,"\"id\":")
                            .replace(/name:/,"\"name\":")
                            .replace(/description:/,"\"description\":")
                            .replace(/category:/,"\"category\":")
                            .replace(/parentCategory:/,"\"parentCategory\":")
                            .replace(/[\"],[\s]*}/,"\" }")
                    );

                    if(!permission.id) {
                        var errMsg = `Permission '${permission.name}' found without an id in file '${file}'`;
                        console.log();
                        console.log(errMsg);
                        throw errMsg;
                    }

                    var permissionInFile = permissions.find(p => p.id.toUpperCase() == permission.id.toUpperCase());

                    if(permissionInFile) {
                        permissionInFile.name = permission.name;
                        permissionInFile.description = permission.description;
                        permissionInFile.category = permission.category;
                        permissionInFile.parentCategory = permission.parentCategory;
                    } else {
                        permission.id = permission.id.toUpperCase();
                        permissions.push(permission);
                    }
                }

            } while(regExResult);

            var availablePermissionsJson = JSON.stringify(permissions, null, 2);

            fs.writeFileSync(outputFile, availablePermissionsJson);

            //console.log(JSON.stringify(permissions, null, 2));
        });
};

dir.files(sourceDir, 'file', fileProcessor);





