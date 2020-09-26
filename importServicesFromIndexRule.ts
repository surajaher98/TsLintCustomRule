import * as Lint from 'tslint';
import { Rules, RuleWalker } from 'tslint';
import * as ts from 'typescript';

export class Rule extends Rules.AbstractRule {

    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'import-services-from-index',
        description: 'Allows services to be imported within the module from service index.ts file or'
         + 'outside module using path starting from  @app/',
        descriptionDetails: 'Allows the service to be imported within the module from service index.ts file or' +
         + 'outside module using path starting from  @app/',
        hasFix: true,
        optionsDescription: 'Not configurable.',
        options: null,
        optionExamples: [true],
        type: 'functionality',
        typescriptOnly: false,
    };
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}
function walk(ctx: Lint.WalkContext) {
    for (const statement of ctx.sourceFile.statements) {
        if (statement.kind === ts.SyntaxKind.ImportDeclaration) {  
            if (statement.getText().includes('service')) {
                // compare the current file path
                if (checkImportedServiceModuleAndWorkingFileModuleIsSame(ctx.sourceFile.fileName, statement.getText())) {
                // to handle imports in the own module file
                // import { LoginService } from './services/login.service';
                if (statement.getText().includes('/services/') &&  statement.getText().includes('.service\'') &&
                (!statement.getText().includes('\'./services\'')) && ((!statement.getText().includes('.module')))) {   
                    const FAILURE_STRING = 'Import from index file (Same Module)';                                    
                    const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(),
                    statement.getText().substring(0, statement.getText().indexOf('from')).concat('from \'./services\';'));              
                    ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), FAILURE_STRING, fix);
                }
                // to handle the imports in the own module components
                // import { LoginService } from '../../services/login.service';
                // import { SharedService } from '@app/shared.module/services/shared.service';
                if (statement.getText().includes('../../services/') &&  statement.getText().includes('.service\'') &&
                (!statement.getText().includes('./../services\';'))) { 
                    const FAILURE_STRING = 'Import from index file (Same Module)';                   
                    const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(),
                 statement.getText().substring(0, statement.getText().indexOf('from')).concat('from \'../../services\';'));              
                    ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), FAILURE_STRING, fix);
                }
                // to handle the cases like if we need to import the service in same module
                if ((statement.getText().includes('@app/') || (statement.getText().includes('.module'))) && 
                (!statement.getText().includes('\'./services'))) { 
                   const moduleName  = getModuleName( statement.getText()); 
                   const FAILURE_STRING = 'Import from index file (You are trying to use service present in same Modules' + 
                   ' so try to use relative path like ../../....'; 
                //                       
                   const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(), statement.getText().substring(0,
                    statement.getText().indexOf('from')).concat('from \'../../services\';'));
                   ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), FAILURE_STRING, fix);
               }
                // user tries to use the path like @app/.module though the service is present in the same module
               if (statement.getText().includes('@app/') && 
               (statement.getText().includes('.module'))) { 
                  const moduleName  = getModuleName( statement.getText()); 
                  const FAILURE_STRING = 'Import from index file (You are trying to use service present in same Modules' + 
                  ' so try to use relative path like ../../....';                     
                  const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(), statement.getText().substring(0,
                   statement.getText().indexOf('from')).concat('from \'../../services\';'));
                  ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), FAILURE_STRING, fix);
              }

               if (statement.getText().includes('../../../') &&  statement.getText().includes('.module') && 
               (!statement.getText().includes('@app/')) &&
               ((statement.getText().includes('/services')) || ((statement.getText().includes('.service'))))) {   
                   const FAILURE_STRING = 'Import from index file (Service is not present in' +
                    + ' same Module)';                       
                    const moduleName  = getModuleName( statement.getText());                                  
                   const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(),
                   statement.getText().substring(0, statement.getText().indexOf('from')).concat('from \'@app/' + moduleName + '\';'));    
                   ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), FAILURE_STRING, fix);
               }

            } else if (!checkImportedServiceModuleAndWorkingFileModuleIsSame(ctx.sourceFile.fileName, statement.getText())) {{

                // to handle imports in the other module
                // import { SharedService } from '@app/shared.module/services';
                // import { SharedService } from '@app/shared.module/services/shared.service.ts';
                if (statement.getText().includes('@app/') &&  statement.getText().includes('.module/services') || 
                (statement.getText().includes('.service')) && (!statement.getText().includes('.module\''))) { 
                    const moduleName  = getModuleName( statement.getText()); 
                    const FAILURE_STRING = 'Import from index file (Use the shortes path)';                                    
                    const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(), statement.getText().substring(0,
                         statement.getText().indexOf('from')).concat('from \'@app/' + moduleName + '\';'));              
                    ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), FAILURE_STRING, fix);
                }
                // if the user tries to use the path like ../../../ not by using @app/
                if (statement.getText().includes('../../../') && statement.getText().includes('.module') &&
                (!statement.getText().includes('@app/'))) {   
                    const FAILURE_STRING = 'Import from index file (You are trying to use service in different Modules' + 
                    'so try to use full path like  @app/....  )';
                    const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(),
                    statement.getText().substring(0, statement.getText().indexOf('from')).concat('from \'./services\';'));              
                    ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), FAILURE_STRING, fix);
                }   
                }
            }
    }
    
}
    }
function getModuleName(path) {
    let rawModuleName = '';
    if (path.includes('.module')) {
        const rawModuleNameArray = path.split('/'); // get the module name fom From clause string 
       
        for (const item of rawModuleNameArray) {
            if (item.includes('.module')) {
                rawModuleName = item;
                break;
            }
        }
    }
    return rawModuleName;
}
    

function checkImportedServiceModuleAndWorkingFileModuleIsSame(filePath, statement) {
   const importedServiceModuleName = getModuleName(statement);
   const currentWorkingFileModule = getModuleName(filePath);
    if (importedServiceModuleName === importedServiceModuleName) {
        return true;
    }
    return false;
}
}


