import axios from 'axios';

import React, { useRef, useState } from 'react';
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
import { ImProfile } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UsersStateContext, UsersDispatchContext } from '../App';

import ProfileCard from './ProfileCard';
import Comment from './comment/Comment';
// 인자에 사용하고 싶은 유저 property를 가져와서 사용!
const ProfileContainer = it => {
  const navigate = useNavigate();
  const id = it.id;

  const { loginUser } = useContext(UsersStateContext);

  const { refreshLoginUserInfo } = useContext(UsersDispatchContext);

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
        switch (element) {
          case 'frontend':
            temp.push('FrontEnd');
            break;
          case 'backend':
            temp.push('BackEnd');
            break;
          case 'embedded':
            temp.push('Embedded');
            break;
          default:
            console.log('포지션에서 특정 못함');
        }
      }
    });
    return temp;
  };

  const getPreferTrack = () => {
    const TrackList = Object.keys(it.track);
    let temp = [];
    TrackList.forEach(element => {
      if (it.track[element] === true) {
        switch (element) {
          case 'ai':
            temp.push('AI');
            break;
          case 'iot':
            temp.push('IoT');
            break;
          case 'bigdata':
            temp.push('BigData');
            break;
          case 'blockchain':
            temp.push('BlockChain');
            break;
          case 'metabus':
            temp.push('Metabus');
            break;
          default:
            console.log('트랙에서 특정못함');
        }
      }
    });
    return temp;
  };

  // 댓글창 on/off
  const [commentToggle, setCommentToggle] = useState(false);

  // 좋아요 아이콘 토글
  const defaultLikeIcon = loginUser.followingUsers.includes(id);
  const [likeToggle, setLikeToggle] = useState(defaultLikeIcon);

  // 좋아요 카운트
  const [likeCnt, setLikeCnt] = useState(it.likeCnt);

  // 좋아요 기능
  const following = () => {
    // 좋아요 취소
    if (likeToggle) {
      setLikeCnt(likeCnt - 1);
      axios({
        method: 'delete',
        url: 'api/users/like',
        data: {
          followUser: String(id),
          user: parseInt(loginUser.id),
        },
      }).then(
        refreshLoginUserInfo(),
        setLikeToggle(() => !likeToggle)
      );
    }
    // 좋아요 추가
    else {
      setLikeCnt(likeCnt + 1);
      axios({
        method: 'post',
        url: 'api/users/like',
        data: {
          followUser: parseInt(id),
          user: parseInt(loginUser.id),
        },
      }).then(
        refreshLoginUserInfo(),
        setLikeToggle(() => !likeToggle)
      );
    }
  };

  // mouseOver CSS
  const container = useRef();
  const buttonA = useRef();
  const buttonB = useRef();
  const onHover = () => {
    container.current.style.backgroundColor = '#E2E8F0';
    buttonA.current.style.backgroundColor = '#E2E8F0';
    buttonB.current.style.backgroundColor = '#E2E8F0';
  };

  const offHover = () => {
    container.current.style.backgroundColor = 'white';
    buttonA.current.style.backgroundColor = 'white';
    buttonB.current.style.backgroundColor = 'white';
  };

  const buttonAonHover = e => {
    buttonA.current.style.backgroundColor = '#E2E8F0';
  };
  const buttonBonHover = e => {
    buttonB.current.style.backgroundColor = '#E2E8F0';
  };
  const buttonAoffHover = e => {
    buttonA.current.style.backgroundColor = 'white';
  };
  const buttonBoffHover = e => {
    buttonB.current.style.backgroundColor = 'white';
  };

  // 렌더링
  if (loginUser) {
    return (
      <div>
        <Flex
          bg="#822727"
          _dark={{ bg: '#3e3e3e' }}
          p={50}
          w="full"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            ref={container}
            pt={7}
            w="md"
            mx="auto"
            bg="white"
            _dark={{ bg: 'gray.800' }}
            shadow="lg"
            rounded="lg"
            overflow="hidden"
            boxShadow="xl"
          >
            {/* userId를 파라미터로 하는 detail/{id} 페이지로 이동 */}
            {/* 이 이미지 자리에 프로필 카드 컴포넌트가 들어가면 됨 */}
            {/* <Box w="full">하하</Box> */}

            <Box display="flex" justifyContent="center">
              {commentToggle ? (
                <Comment profileUserId={id} />
              ) : (
                <Box
                  onClick={goDetail}
                  cursor="pointer"
                  onMouseOver={onHover}
                  onMouseOut={offHover}
                >
                  <ProfileCard {...it} />
                </Box>
              )}
            </Box>

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
                    <Container p={0}>
                      {getPreferPosition().join(' / ')}
                    </Container>
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
                <Box display="flex" flexDirection="row-reverse">
                  <IconButton
                    ref={buttonA}
                    onMouseOver={buttonAonHover}
                    onMouseOut={buttonAoffHover}
                    backgroundColor="white"
                    aria-label="Call Sage"
                    fontSize="30px"
                    icon={
                      parseInt(id) !== parseInt(loginUser.id) ? (
                        likeToggle ? (
                          <Box onClick={following}>
                            <RiHeartsFill />
                          </Box>
                        ) : (
                          <Box onClick={following}>
                            <RiHeartsLine />
                          </Box>
                        )
                      ) : (
                        <RiHeartsFill />
                      )
                    }
                  />
                  <Box display="flex" alignItems="center" pr="1" fontSize="23">
                    {likeCnt}
                  </Box>
                </Box>
                {/* 댓글창 */}
                <Box display="flex" flexDirection="row-reverse">
                  <IconButton
                    ref={buttonB}
                    onMouseOver={buttonBonHover}
                    onMouseOut={buttonBoffHover}
                    backgroundColor="white"
                    aria-label="Call Sage"
                    fontSize="30px"
                    icon={commentToggle ? <ImProfile /> : <BiCommentDetail />}
                    onClick={() => setCommentToggle(!commentToggle)}
                  />
                  <Box
                    display="flex"
                    alignItems="center"
                    pr="1"
                    fontSize="23"
                  ></Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Flex>
      </div>
    );
  }
};

export default React.memo(ProfileContainer);
