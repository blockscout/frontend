import { Flex } from '@chakra-ui/react';
import { noop } from 'es-toolkit';
import React from 'react';

import { test, expect } from 'playwright/lib';

import CodeEditorSideBar from './CodeEditorSideBar';
import * as codeEditorMock from './mocks';

test('list view +@dark-mode', async({ render, page }) => {
  await render(
    <Flex h="300px">
      <CodeEditorSideBar
        monaco={ undefined }
        editor={ undefined }
        data={ codeEditorMock.filesWithConflict }
        isTreePossible={ false }
        onFileSelect={ noop }
        selectedFile={ codeEditorMock.twinFileWithConflict.key }
        mainFile={ codeEditorMock.mainFileWithConflict.key }
      />
    </Flex>,
  );

  await expect(page.getByRole('complementary', { name: 'Side bar' })).toHaveScreenshot();
});

test('tree view', async({ render, page }) => {
  await render(
    <Flex h="300px">
      <CodeEditorSideBar
        monaco={ undefined }
        editor={ undefined }
        data={ codeEditorMock.filesWithoutConflict }
        isTreePossible
        onFileSelect={ noop }
        selectedFile={ codeEditorMock.selectedFileWithoutConflict.key }
        mainFile={ codeEditorMock.mainFileWithoutConflict.key }
      />
    </Flex>,
  );

  await expect(page.getByRole('complementary', { name: 'Side bar' })).toHaveScreenshot();
});
