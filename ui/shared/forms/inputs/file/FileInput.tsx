import { InputGroup, VisuallyHiddenInput } from '@chakra-ui/react';
import type { ChangeEvent } from 'react';
import React from 'react';
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

interface InjectedProps {
  onChange: (files: Array<File>) => void;
}

interface Props<V extends FieldValues, N extends Path<V>> {
  children: React.ReactNode | ((props: InjectedProps) => React.ReactNode);
  field: ControllerRenderProps<V, N>;
  accept?: string;
  multiple?: boolean;
}

const FileInput = <Values extends FieldValues, Names extends Path<Values>>({ children, accept, multiple, field }: Props<Values, Names>) => {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!multiple && field.value?.length === 0 && ref.current?.value) {
      ref.current.value = '';
    }
  }, [ field.value?.length, multiple ]);

  const onChange = React.useCallback((files: Array<File>) => {
    field.onChange([ ...(field.value || []), ...files ]);
  }, [ field ]);

  const handleInputChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) {
      return;
    }

    const files = Array.from(fileList);
    onChange(files);
    field.onBlur();
  }, [ onChange, field ]);

  const handleClick = React.useCallback(() => {
    ref.current?.click();
  }, []);

  const handleInputBlur = React.useCallback(() => {
    field.onBlur();
  }, [ field ]);

  const injectedProps = React.useMemo(() => ({
    onChange,
  }), [ onChange ]);

  const content = typeof children === 'function' ? children(injectedProps) : children;

  return (
    <InputGroup onClick={ handleClick } onBlur={ handleInputBlur }>
      <VisuallyHiddenInput
        type="file"
        onChange={ handleInputChange }
        ref={ ref }
        accept={ accept }
        multiple={ multiple }
        name={ field.name }
      />
      { content }
    </InputGroup>
  );
};

export default FileInput;
