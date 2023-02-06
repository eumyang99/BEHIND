import ReCommentList from './ReCommentList';

// 대댓글 열기 버튼
// chakra - Collapse transition

import {
  Box,
  IconButton,
  Input,
  InputRightElement,
  Button,
  InputGroup,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  useEditableControls,
  ButtonGroup,
  Flex,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useRef, useContext, useState } from 'react';
import { UsersStateContext } from '../../App';
import axios from 'axios';
import { CommentDispatchContext } from './Comment';
const CommentListItem = it => {
  const { loginUser } = useContext(UsersStateContext);
  const { getCommentList } = useContext(CommentDispatchContext);
  const inputContent = useRef();
  console.log(it);

  const [thisComment, setThisComment] = useState(it.comment);
  const thisCommentHandleChange = e => {
    setThisComment(e);
  };
  const editComment = () => {
    axios({
      url: 'api/comment',
      method: 'patch',
      headers: { 'Content-Type': 'application/json' },
      data: {
        commentId: parseInt(it.commentId),
        content: thisComment,
      },
    })
      .then(() => {
        getCommentList();
      })
      .catch(function (error) {
        // 오류발생시 실행
        console.log(error);
      });
  };
  // const timeNow = new Date(new Date().getTime() + 1000 * 60 * 60 * 9)
  //   .toISOString()
  //   .replace('T', ' ')
  //   .split('.')[0];

  const replySave = e => {
    e.preventDefault();
    //추가 데이터
    const newReply = {
      writerId: parseInt(loginUser.id),
      content: e.target[0].value,
      commentId: parseInt(it.commentId),
    };
    axios({
      url: 'api/reply',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        ...newReply,
      },
    })
      .then(() => {
        inputContent.current.value = '';
        getCommentList();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup alignItems="center" justifyContent="center" size="sm">
        <Box onClick={editComment}>
          <IconButton
            size="xs"
            icon={<CheckIcon />}
            {...getSubmitButtonProps()}
          />
        </Box>

        <IconButton
          size="xs"
          icon={<CloseIcon />}
          {...getCancelButtonProps()}
        />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton size="sm" icon={<EditIcon />} {...getEditButtonProps()} />
      </Flex>
    );
  }
  const deleteComment = () => {
    axios({
      method: 'delete',
      url: 'api/comment',
      params: {
        id: it.commentId,
      },
      headers: { 'Content-Type': 'application/json' },
    }).then(() => {
      getCommentList();
    });
  };

  return (
    <Box
      p={2}
      pl={3}
      pr={3}
      borderBottom="0.5px solid"
      borderColor="blackAlpha.300"
      backgroundColor="gray.100"
    >
      {/* 작성자, 작성시간, 댓글 내용 */}
      <Box mb="2">
        {/* 작성자, 작성시간, 삭제버튼 */}
        <Box display="flex" justifyContent="space-between">
          {/* 작성자, 작성시간 */}
          <Box display="flex" alignItems="center">
            {/* 작성자 */}
            <Box
              display="flex"
              flexDirection="column-reverse"
              fontSize="sm"
              mr={2}
              fontWeight="bold"
            >
              {it.writerName}
            </Box>
            {/* 작성시간 */}
            <Box
              display="flex"
              flexDirection="column-reverse"
              fontSize="2xs"
              color="gray.500"
              fontStyle="italic"
            >
              {it.createTime}
            </Box>
          </Box>

          {/* 삭제 버튼 */}
          <Box display="flex" flexDirection="column-reverse">
            {loginUser.id === it.writerId ? (
              <IconButton
                size="sm"
                onClick={deleteComment}
                icon={<DeleteIcon />}
              />
            ) : (
              <></>
            )}
          </Box>
        </Box>
        {/* 댓글 */}
        <Editable
          display="flex"
          justifyContent="space-between"
          textAlign="start"
          defaultValue={it.content}
          fontSize="sm"
          isPreviewFocusable={false}
          onChange={thisCommentHandleChange}
        >
          <EditablePreview />
          {/* Here is the custom input */}
          <Input height="8" fontSize="sm" as={EditableInput} />

          {loginUser.id === it.writerId ? <EditableControls /> : <></>}
        </Editable>
      </Box>

      {/* 대댓글, 대댓글 달기 */}
      <Box>
        {/* 대댓글 */}
        <Box mt={1} ml={3}>
          <ReCommentList replys={it.replys} />
        </Box>
        {/* 대댓글 달기 */}
        <Box as="form" onSubmit={replySave}>
          <InputGroup backgroundColor="white" size="xs" borderRadius={5}>
            <Input
              ref={inputContent}
              fontSize={11}
              pr="4.5rem"
              placeholder="댓글을 입력주세요"
            />
            <InputRightElement width="4.5rem">
              <Button type="submit" h="1rem" size="xs">
                Enter
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
      </Box>
    </Box>
  );
};

export default CommentListItem;
