import * as Lint from 'tslint';
import { Rules, RuleWalker } from 'tslint';
import * as ts from 'typescript';
const path = require('path');
const fs = require('fs');

export class Rule extends Rules.AbstractRule {
    // public static FAILURE_STRING = 'Model file should end with .model.ts';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}
function walk(ctx: Lint.WalkContext) {
    for (const statement of ctx.sourceFile.statements) {
        if (statement.kind === ts.SyntaxKind.ExportDeclaration) {  
            if (!statement.getText().includes('.module')) {  
                if (ctx.sourceFile.fileName.includes('/models/index.ts')) {                      
                      const filePath = statement.getText().split('from')[1].trim().replace(/'/g, '').replace(';', '');                    
                      if (!(statement.getText().includes('.model\''))) {
                      //  console.log('statement', statement.getText());
                     //  console.log('path', filePath);
                        let pathAfterAppendingModel = filePath.trim() + '.model';
                        pathAfterAppendingModel = pathAfterAppendingModel.replace('./', ''); 
                      // console.log('pathAfterAppendingModel', pathAfterAppendingModel);
                        const newFilename = path.dirname(ctx.sourceFile.fileName) + '/' +  pathAfterAppendingModel + '.ts'; 
                       // console.log('newFilename', newFilename);
                        const oldFilePath = newFilename.replace('.model', '');
                       // console.log('oldFilePath', oldFilePath);                       
                        const newFromPath = '\'./' + pathAfterAppendingModel + '\';';
                        const pathAfterReplace = statement.getText().split('from')[0].trim();
                         const fixFromPath = new Lint.Replacement(statement.getStart(), statement.getWidth(),
                         pathAfterReplace + ' from \'./' + pathAfterAppendingModel + '\'' + ';'); 
                      //   console.log('pathAfterReplace', fixFromPath);
                    //      const FixrenameFile = new Lint.Replacement(statement.getStart(), statement.getWidth(),
                    //     fs.rename(oldFilePath, newFilename,
                    // () => { 
  
                    //   }),
                    //      );
                        //  fs.rename(oldFilePath, newFilename,
                        //     () => { 
          
                        // });
                        ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), 'Model file should end with .model.ts', fixFromPath);
                      //  ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), Rule.FAILURE_STRING, FixrenameFile);
                        }       
                        
                        if (statement.getText().includes('.model') && statement.getText().includes('*')) { 
                            const rawModelName = statement.getText().split('/')[1].split('.')[0]; // get the service name fom From clause
                            const modelName = rawModelName.charAt(0).toUpperCase() + rawModelName.slice(1).replace(/-([a-z])/g, 
                            function (g) { return g[1].toUpperCase(); }).concat('Model');
                            const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(),
                            statement.getText().replace('*', '{ I' + modelName + ' }'));
                            ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), 'Use model or interface name for export', fix);
                        }
                }
        }
                               
        }
        }
    }

                // for model
                    // check the model keyword in the exported components in index.ts file if not found then  upadte the detail in
                    // exports statement  and the rename the model file 
                 
