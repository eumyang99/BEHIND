import { Box, VStack, Image } from '@chakra-ui/react';
const Login = () => {
  return (
    <Box h="100vw" bg="yellow.50">
      <VStack>
        <a
          mt="10"
          href="http://ec2-13-209-17-196.ap-northeast-2.compute.amazonaws.com:8080/oauth2/authorization/kakao"
        >
          <Image
            w="70vw"
            mt="10"
            src="images/kakao_login_large_narrow.png"
            borderRadius="12"
            shadow="md"
          ></Image>
        </a>
        <a
          mt="10"
          href="http://ec2-13-209-17-196.ap-northeast-2.compute.amazonaws.com:8080/oauth2/authorization/google"
        >
          <Image
            w="72vw"
            mt="2"
            src="images/btn_google_signin_light_normal_web@2x.png"
          ></Image>
        </a>
      </VStack>
    </Box>
  );
};

export default Login;