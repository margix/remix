import { default as category } from './categories'
import { default as algorithm } from './algorithmCategories'
import { isDeleteFromDynamicArray, isMappingIndexAccess } from './staticAnalysisCommon'
import { AnalyzerModule, ModuleAlgorithm, ModuleCategory, ReportObj, CompilationResult, UnaryOperationAstNode} from './../../types'

export default class deleteFromDynamicArray implements AnalyzerModule {
  relevantNodes: UnaryOperationAstNode[] = []
  name: string = 'Delete from dynamic Array: '
  description: string = 'Using delete on an array leaves a gap'
  category: ModuleCategory = category.MISC
  algorithm: ModuleAlgorithm = algorithm.EXACT

  visit (node: UnaryOperationAstNode): void {
    if (isDeleteFromDynamicArray(node) && !isMappingIndexAccess(node.subExpression)) this.relevantNodes.push(node)
  }

  report (compilationResults: CompilationResult): ReportObj[] {
    return this.relevantNodes.map((node) => {
      return {
        warning: 'Using delete on an array leaves a gap. The length of the array remains the same. If you want to remove the empty position you need to shift items manually and update the length property.\n',
        location: node.src,
        more: 'https://github.com/miguelmota/solidity-idiosyncrasies'
      }
    })
  }
}
