import * as Lint from 'tslint';
import { Rules, RuleWalker } from 'tslint';
import * as ts from 'typescript';

export class Rule extends Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'import-components-from-index',
        description: 'Allows the component to be imported within the module from components index.ts file or'
         + 'outside module using path starting from  @app/',
        descriptionDetails: 'Allows the component to be imported within the module from components index.ts file or' +
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
            if (statement.getText().includes('Component')) { 
                if (!statement.getText().includes('@angular/core'))  {          
                    if ((statement.getText().includes('./components/')) && 
                    (statement.getText().includes('.component\'')) && 
                      (!statement.getText().includes('\'./components\''))) { 
                        const FAILURE_STRING = 'Import from index file (Same Module)';                   
                        const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(),
                        statement.getText().substring(0, statement.getText().indexOf('from')).concat('from \'./components\';')); 
                        ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), FAILURE_STRING, fix);
                    }

                 // import in component of own module 
                 // import { LoginComponent } from '../login/login.component'; 
                      if ((statement.getText().includes('../')) && 
                      (statement.getText().includes('.component\'')) &&
                      (!statement.getText().includes('\'../../components\''))) {
                        const FAILURE_STRING = 'Import from index file (Same Module)'; 
                          const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(),
                          statement.getText().substring(0, statement.getText().indexOf('from')).concat('from \'../../components\';'));
                          ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), FAILURE_STRING, fix);
                    }
                      // other module   
                // import { LoginComponent } from './login.module/components/login/login.component';
                // @app/login.module/components
                if ((statement.getText().includes('.module/components')) && 
                (statement.getText().includes('.component\'')) &&
                (!statement.getText().includes('@app/'))) {
                    const FAILURE_STRING = 'Import from index file (You are trying to use component in multiple Modules' + 
                    'so try to put it in Shared Module'; 
                    const rawModuleNameArray = statement.getText().split('/'); // get the module name fom From clause                
                    let rawModuleName = '';
                    for (const item of rawModuleNameArray) {
                        if (item.includes('module')) {
                            rawModuleName = item;
                            break;
                        }
                    }    
                   const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(),
                    statement.getText().substring(0, statement.getText().indexOf('from')).concat('from \'@app/' + rawModuleName + '\';'));
                    ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), FAILURE_STRING, fix);               
                }

                // Other module
               // import { ResetPasswordUserComponent } from './login.module/components';
                // import { LoginComponent } from './login.module/login.module';
                // import { LoginComponent } from './login.module/components';
                // import { LoginComponent } from './login.module';
                if ((statement.getText().includes('.module')) && 
                    (!statement.getText().includes('@app/'))) {
                        const FAILURE_STRING = 'Import from index file (You are trying to use component in multiple Modules' + 
                        'so try to put it in Shared Module'; 
                      const rawModuleNameArray = statement.getText().split('/'); // get the module name fom From clause                
                    let rawModuleName = '';
                    for (const item of rawModuleNameArray) {
                        if (item.includes('module')) {
                            rawModuleName = item;
                            break;
                        }
                    }    
                    const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(),
                    statement.getText().substring(0, statement.getText().indexOf('from')).concat('from \'@app/' + rawModuleName + '\';'));
                 
                    // tslint:disable-next-line: deprecation
                    ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), FAILURE_STRING, fix); 
                }
                  // import { EventDetailsComponent } from '../../../event.module';
            if ((statement.getText().includes('../../../')) &&
              (statement.getText().includes('.module')) && 
              (!statement.getText().includes('@app/'))) {
                const FAILURE_STRING = 'Import from index file (You are trying to use component in multiple Modules' + 
                'so try to put it in Shared Module';
                const rawModuleNameArray = statement.getText().split('/'); // get the module name fom From clause                
                let moduleName = '';
                for (const item of rawModuleNameArray) {
                    if (item.includes('module')) {
                        moduleName = item;
                        break;
                    }
                } 
              const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(),
              statement.getText().substring(0, statement.getText().indexOf('from')).concat('from \'@app/' + moduleName + '\';'));
              ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), FAILURE_STRING, fix); 
}
               }

        }
    }
    }
}

