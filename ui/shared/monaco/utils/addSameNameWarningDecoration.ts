import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

// possible cases
// https://docs.soliditylang.org/en/latest/grammar.html#a4.SolidityParser.contractDefinition
//
// contract ERC721 {//this is a mock contract
// contract FOO{
// abstract contract Bar{
// contract ZkBobDirectDepositQueue is IZkBobDirectDeposits, IZkBobDirectDepositQueue, EIP1967Admin, Ownable {
//
// regexp -> /^(abstract )?contract (\w+)\s?( is (\w|\s|,)+)?{/gmi

export default function addSameNameWarningDecoration(model: monaco.editor.ITextModel, contractName: string) {
  const options: monaco.editor.IModelDecorationOptions = {
    // className: '.risk-warning',
    hoverMessage: [
      // TODO @tom2drum: change tooltip content for same name contract
      { value: 'The main file containing verified contract' },
    ],
  };

  const matches = model.findMatches(`^(abstract )?contract (${ contractName })\\s?( is (\\w|\\s|,)+)?\\{`, false, true, false, null, true);
  const decorations: Array<monaco.editor.IModelDeltaDecoration> = matches.map(({ range, matches }) => {
    const startColumn = matches ? matches[0].indexOf(contractName) + 1 : 0;

    return {
      range: {
        ...range,
        startColumn,
        endColumn: startColumn ? startColumn + contractName.length : 0,
      },
      options,
    };
  });

  model.deltaDecorations([], decorations);
}
