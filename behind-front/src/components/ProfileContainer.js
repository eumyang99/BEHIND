import axios from 'axios';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Image,
  chakra,
  Container,
  IconButton,
} from '@chakra-ui/react';
import { RiHeartsLine, RiHeartsFill } from 'react-icons/ri';
import { BiCommentDetail } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UsersStateContext, UsersDispatchContext } from '../App';
// 인자에 사용하고 싶은 유저 property를 가져와서 사용!
const ProfileItem = it => {
  const navigate = useNavigate();
  const id = it.id;

  const { loginUser } = useContext(UsersStateContext);
  // const { refreshLoginUserInfo } = useContext(UsersDispatchContext);

  // 내 프로필 클릭하면 mypage로 보내는 기능
  const goDetail = () => {
    if (parseInt(loginUser.id) === parseInt(id)) {
      return navigate('/mypage');
    } else {
      return navigate(`/detail/${id}`);
    }
  };

  // 선호 포지션, 선호 트랙 추출
  const getPreferPosition = () => {
    const positionList = Object.keys(it.position);
    let temp = [];
    positionList.forEach(element => {
      if (it.position[element] === true) {
        temp.push(element);
      }
    });
    return temp;
  };

  const getPreferTrack = () => {
    const TrackList = Object.keys(it.track);
    let temp = [];
    TrackList.forEach(element => {
      if (it.track[element] === true) {
        temp.push(element);
      }
    });
    return temp;
  };

  // 좋아요 아이콘 토글
  const defaultLikeIcon = loginUser.followingUsers.includes(id);
  const [likeToggle, setLikeToggle] = useState(defaultLikeIcon);
  // 좋아요 기능

  const following = () => {
    // 좋아요 취소
    if (!likeToggle) {
      axios({
        method: 'delete',
        url: '/user/like',
        data: {
          followUser: id,
          user: loginUser.id,
        },
      });
      setLikeToggle(() => !likeToggle);
    }
    // 좋아요 추가
    else {
      axios({
        method: 'post',
        url: '/user/like',
        data: {
          followUser: id,
          user: loginUser.id,
        },
      });
      setLikeToggle(() => !likeToggle);
    }
  };

  return (
    <div>
      <Flex
        bg="#edf3f8"
        _dark={{ bg: '#3e3e3e' }}
        p={50}
        w="full"
        alignItems="center"
        justifyContent="center"
      >
        {id}
        <Box
          w="sm"
          mx="auto"
          bg="white"
          _dark={{ bg: 'gray.800' }}
          shadow="lg"
          rounded="lg"
          overflow="hidden"
        >
          {/* userId를 파라미터로 하는 detail/{id} 페이지로 이동 */}
          <Image
            onClick={goDetail}
            w="full"
            //h={1000}
            fit="cover"
            objectPosition="center"
            // 프로필 카드 이미지 자리
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
            alt="avatar"
          />

          {/* 정보 % 버튼 */}
          <Box display="flex" justifyContent="space-between">
            {/* 정보*/}
            <Box
              h={160}
              py={6}
              px={6}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              {/* 선호 포지션 */}
              <Box>
                <Flex
                  alignItems="center"
                  color="gray.700"
                  _dark={{ color: 'gray.200' }}
                >
                  <chakra.h1 fontSize="sm">선호 포지션</chakra.h1>
                </Flex>
                <chakra.h1
                  fontSize="lg"
                  fontWeight="bold"
                  color="gray.800"
                  _dark={{ color: 'white' }}
                >
                  <Container p={0}>{getPreferPosition().join(' / ')}</Container>
                </chakra.h1>
              </Box>

              {/* 선호 트랙 */}
              <Box>
                <Flex
                  alignItems="center"
                  color="gray.700"
                  _dark={{ color: 'gray.200' }}
                >
                  <chakra.h1 fontSize="sm">선호 트랙</chakra.h1>
                </Flex>
                <chakra.h1
                  fontSize="lg"
                  fontWeight="bold"
                  color="gray.800"
                  _dark={{ color: 'white' }}
                >
                  <Container p={0}>{getPreferTrack().join(' / ')}</Container>
                </chakra.h1>
              </Box>
            </Box>
            {/* 버튼 */}
            <Box
              h={160}
              py={6}
              px={6}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              {/* 좋아요 */}
              <Box>
                <IconButton
                  backgroundColor="white"
                  aria-label="Call Sage"
                  fontSize="30px"
                  onClick={following}
                  icon={
                    parseInt(id) !== parseInt(loginUser.id) ? (
                      likeToggle ? (
                        <RiHeartsFill />
                      ) : (
                        <RiHeartsLine />
                      )
                    ) : (
                      <></>
                    )
                  }
                />
              </Box>
              {/* 댓글창 */}
              <Box>
                <IconButton
                  backgroundColor="white"
                  aria-label="Call Sage"
                  fontSize="30px"
                  icon={<BiCommentDetail />}
                  // onClick={}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Flex>
    </div>
  );
};

export default ProfileItem;
