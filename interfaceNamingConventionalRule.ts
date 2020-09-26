import * as utils from 'tsutils';
import * as Lint from 'tslint';
import { Rules, RuleWalker } from 'tslint';
import * as ts from 'typescript';
const fs = require('fs');
const path = require('path');


export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'interface-naming-conventional',
        description: 'Warns the user to use the models name same as te model file name in the camalCase form ',
        descriptionDetails: 'Warns the user to use the models name same as te model file name in the camalCase form',
        hasFix: true,
        optionsDescription: 'Not configurable.',
        options: null,
        optionExamples: [true],
        type: 'functionality',
        typescriptOnly: false,
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walkInterface, {
            never: this.ruleArguments.indexOf('always-prefix') !== -1,
        });
    }
}

function walkInterface(ctx: Lint.WalkContext<{ never: boolean }>): void {
    const {
        options: { never },
    } = ctx;
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (utils.isInterfaceDeclaration(node)) { 
          //  console.log('ctx.sourceFile.fileName.', ctx.sourceFile.fileName);
            // console.log('filename', ctx.sourceFile.fileName.replace(/^.*[\\\/]/, ''));
            
                  
                // if (node.getText().substring(0, node.getText().indexOf('{')).replace(/\s/g, '').charAt(15).toUpperCase() !== 'I') {
                //     const fix =  new Lint.Replacement(node.getStart(), node.getWidth(),
                //     [node.getText().replace(/\s+/g, ' ').trim().slice(0, 17),
                //      'I', node.getText().slice(17)].join(''));
                //     ctx.addFailureAtNode(node, 'Interface name must start with a capitalized I', fix);
                // }

            if (ctx.sourceFile.fileName.includes('/models/') && (ctx.sourceFile.fileName.includes('-model.ts'))) {
                ctx.addFailureAtNode(node, 'filename should not contain -model.ts should contain .model.ts'); 
             }

             if (ctx.sourceFile.fileName.includes('/models/') && (!(ctx.sourceFile.fileName.includes('.model.ts')))
             &&  (!(ctx.sourceFile.fileName.includes('-model.ts')))) {
                ctx.addFailureAtNode(node, 'model file must end with.model.ts'); 
             }

             if (ctx.sourceFile.fileName.includes('/models/') && 
             (ctx.sourceFile.fileName.replace(/^.*[\\\/]/, '').includes('.model.ts'))) {
                     let fileName = ctx.sourceFile.fileName.replace(/^.*[\\\/]/, '').split('.').slice(0, -1).join('.');
                     fileName = fileName.replace('.', '-');
                     const CamalCaseModelName = fileName.charAt(0).toUpperCase() + fileName.slice(1).replace(/-([a-z])/g, 
                     function (g) { return g[1].toUpperCase(); });
                     
                     const oldInterfaceName = node.getText().trim().split(' ')[2].replace('{', '');
                     if (oldInterfaceName !== CamalCaseModelName) {
                        //  console.log('oldInterfaceName', oldInterfaceName);
                        //  console.log('CamalCaseModelName', CamalCaseModelName);                      

                        const fix =  new Lint.Replacement(node.getStart(), node.getWidth(),
                        node.getText().replace(oldInterfaceName, CamalCaseModelName));
                       // console.log('fix', fix);
                        ctx.addFailureAtNode(node, 'interface name should match with the filename in CamalCase form', fix); 
                     }
                                   
                 }



                // if (node.getText().substring(0, node.getText().indexOf('{')) !== ) {
                //     const fix =  new Lint.Replacement(node.getStart(), node.getWidth(),
                //     [node.getText().replace(/\s+/g, ' ').trim().slice(0, 17),
                //      'I', node.getText().slice(17)].join(''));
                //     ctx.addFailureAtNode(node, '', fix);
                // }
            

        } else  if (utils.isImportDeclaration(node)) { 
             if (ctx.sourceFile.fileName.includes('/models/') && 
            (ctx.sourceFile.fileName.includes('.model.ts'))) {
               if (node.getText().includes('Model ') && !(node.getText().split('from')[1].includes('\'@'))) {
                const fileNameOfImportStatement = node.getText().split('from')[1].replace(';', '');
                const dirPath = path.dirname(ctx.sourceFile.fileName);
                // console.log('filePathToCheckExistInSameDir', dirPath);
                // console.log('ctx.sourceFile.fileName', ctx.sourceFile.fileName);
                // console.log('fileNameOfImportStatement', fileNameOfImportStatement.replace('./', '').replace(/'/g, ''));
                const fileName = fileNameOfImportStatement.replace('./', '').replace(/'/g, '');
                const importFileFullPath = dirPath + '/' + fileName + '.ts';
                if (fs.existsSync(importFileFullPath.replace('/ ', '/').replace(' /', '/'))){
                    const rawFileName = fileName.replace('/ ', '/').replace(' /', '/').replace('.', '-');
                    const CamalCaseModelName = rawFileName.trim().charAt(0).toUpperCase() + 
                    rawFileName.trim().slice(1).replace(/-([a-z])/g, 
                    function (g) { return g[1].toUpperCase(); });
                    const fix =  new Lint.Replacement(node.getStart(), node.getWidth(),
                        'import { ' + CamalCaseModelName + ' } from \'.\';' );
                        // console.log('rawFileName', rawFileName);
                        // console.log('CamalCaseModelName', CamalCaseModelName);
                        
                        // console.log('fix', fix);                        
                        ctx.addFailureAtNode(node, 'imported model is present the same directory, So use only . in path', fix); 
                }
                
             }


            //  const dirPath = path.dirname(ctx.sourceFile.fileName);
            //  fs.readdirSync(dirPath, (err, files) => {
            //     files.forEach(file => {
            //       console.log('hhhhsasa', file);
            //     });
            //   });
                
        }
     } else {
            return ts.forEachChild(node, cb);
        }
    });
}

