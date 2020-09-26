import * as Lint from 'tslint';
import { Rules, RuleWalker } from 'tslint';
import * as ts from 'typescript';

export class Rule extends Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'export-specific-from-index',
        description: 'Allows only specific things to export in the export statement in the index.ts',
        descriptionDetails: 'Disallows the * in the export statement in the index.ts and allows only specific things to' +
         'export in the export statement',
        hasFix: true,
        optionsDescription: 'Not configurable.',
        options: null,
        optionExamples: [true],
        type: 'functionality',
        typescriptOnly: false,
    };
    public static FAILURE_STRING = 'Export * from index is not allowed';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}
function walk(ctx: Lint.WalkContext) {
    for (const statement of ctx.sourceFile.statements) {
        if (statement.kind === ts.SyntaxKind.ExportDeclaration) {  
            if (!statement.getText().includes('.module')) {  
                if (statement.getText().includes('*')) { 
                   // console.log('ctx.sourceFile', ctx.sourceFile.fileName);
                    
                 // for component exports          
                    if (statement.getText().includes('.component')) {                    
                        const rawComponentName = statement.getText().split('/')[1].trim(); // get the component name fom From clause
                        const ComponentName = rawComponentName.charAt(0).toUpperCase() + rawComponentName.slice(1).replace(/-([a-z])/g, 
                        function (g) { return g[1].toUpperCase(); }).concat('Component');
                        const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(),
                        statement.getText().replace('*', '{ ' + ComponentName + ' }'));
                        ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), Rule.FAILURE_STRING, fix);
                    }
                    // for Service exports          
                    if (statement.getText().includes('.service')) {
                        const rawServiceName = statement.getText().split('/')[1].split('.')[0]; // get the service name fom From clause
                        const ServiceName = rawServiceName.charAt(0).toUpperCase() + rawServiceName.slice(1).replace(/-([a-z])/g, 
                        function (g) { return g[1].toUpperCase(); }).concat('Service');
                        const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(),
                        statement.getText().replace('*', '{ ' + ServiceName + ' }'));
                        ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), Rule.FAILURE_STRING, fix);
                    }
                     // for pipe exports          
                    if (statement.getText().includes('.pipe')) {
                        const rawPipeName = statement.getText().split('/')[1].split('.')[0]; // get the service name fom From clause
                        const pipeName = rawPipeName.charAt(0).toUpperCase() + rawPipeName.slice(1).replace(/-([a-z])/g, 
                        function (g) { return g[1].toUpperCase(); }).concat('Pipe');
                        const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(),
                        statement.getText().replace('*', '{ ' + pipeName + ' }'));
                        ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), Rule.FAILURE_STRING, fix);
                    } 
                     // for Guard exports          
                    if (statement.getText().includes('.guard')) {
                        const rawGuardName = statement.getText().split('/')[1].split('.')[0]; // get the guard name fom From clause
                        const guardName = rawGuardName.charAt(0).toUpperCase() + rawGuardName.slice(1).replace(/-([a-z])/g, 
                        function (g) { return g[1].toUpperCase(); }).concat('Guard');
                        const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(),
                        statement.getText().replace('*', '{ ' + guardName + ' }'));
                        ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), Rule.FAILURE_STRING, fix);
                    }
                    
                    // for Directive exports          
                    if (statement.getText().includes('.directive')) {
                        const rawDirectiveName = statement.getText().split('/')[1].split('.')[0]; // get the guard name fom From clause
                        const directiveName = rawDirectiveName.charAt(0).toUpperCase() + rawDirectiveName.slice(1).replace(/-([a-z])/g, 
                        function (g) { return g[1].toUpperCase(); }).concat('Directive');
                        const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(),
                        statement.getText().replace('*', '{ ' + directiveName + ' }'));
                        ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), Rule.FAILURE_STRING, fix);
                    } 

                    // for Models exports          
                    if (statement.getText().includes('.model')) {
                        const rawModelName = statement.getText().split('/')[1].split('.')[0]; // get the guard name fom From clause
                        const ModelName = rawModelName.charAt(0).toUpperCase() + rawModelName.slice(1).replace(/-([a-z])/g, 
                        function (g) { return g[1].toUpperCase(); }).concat('Model');
                        const fix = new Lint.Replacement(statement.getStart(), statement.getWidth(),
                        statement.getText().replace('*', '{ ' + ModelName + ' }'));
                        ctx.addFailureAtNode(statement.getChildAt(1, ctx.sourceFile), Rule.FAILURE_STRING, fix);
                    } 
            }
        }
                               
        }
    }
}
