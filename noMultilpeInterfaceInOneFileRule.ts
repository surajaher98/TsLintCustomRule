import * as utils from 'tsutils';
import * as Lint from 'tslint';
import { Rules, RuleWalker } from 'tslint';
import * as ts from 'typescript';
const fs = require('fs');
const readline = require('readline');


export class Rule extends Lint.Rules.AbstractRule {
 //   public  static FAILURE_STRING = 'Interface name must start with a capitalized I';
 public static allInterfacePaths = [];

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
          // console.log('ctx.sourceFile.fileName.', ctx.sourceFile.fileName);
         //  console.log(node.getText());
        //    if(this.allInterfacePaths && this.allInterfacePaths.includes(ctx.sourceFile.fileName)){
        //        console.log('already present', ctx.sourceFile.fileName);

        //    }
        //    if(this.allInterfacePaths){
        //     this.allInterfacePaths.push(ctx.sourceFile.fileName);
        //    }

            
                        // const fix =  new Lint.Replacement(node.getStart(), node.getWidth(),
                        // [node.getText().replace(/\s+/g, ' ').trim().slice(0, 17),
                        //  'I', node.getText().slice(17)].join(''));
                        // ctx.addFailureAtNode(node, 'Interface name must start with a capitalized I', fix);
 
        } else {
            return ts.forEachChild(node, cb);
        }
    });
}

