import {
    Heading,
    Link,
    Text,
    Flex,
    Box,
    HStack,
    Avatar,
    Stack,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import "./SidePanel.css";

const SidePanel: React.FC = () => {
    return (
        <Flex
            direction='column'
            px={{ base: "6", md: "8", lg: "10%", xl: "15%" }}
            py={{ base: "10", md: "12" }}
            h={{ base: "auto", lg: "100vh" }}
            w='100%'
            className='side-panel'
        >
            <Heading
                as='h2'
                size={{ base: "xl", md: "2xl", lg: "2xl", xl: "3xl" }}
                color='white'
                mb={{ base: "4", md: "5" }}
                mt={{ base: "8", md: "12" }}
            >
                Gaurav Alok Gupta
            </Heading>

            <Heading 
                as='h4' 
                size={{ base: "md", md: "lg" }}
                color='white' 
                mb={{ base: "4", md: "5" }}
            >
                MSc Computer Science Student @ University of St Andrews, UK
            </Heading>

            <Box
                className='introduction'
                maxW='450px'
                w='100%'
                mb={{ base: "8", md: "12", lg: "16" }}
            >
                <Text color='gray.400' fontSize={{ base: "sm", md: "md" }}>
                    Backend-focused Software Engineer with 2+ years of industry experience, previously working as an SDE-2 at Tally Solutions.
                </Text>
            </Box>

            <Box
                className='contact'
                mt={{ base: "6", md: "10", lg: "auto" }}
            >
                <Stack
                    direction={{ base: "column", sm: "row" }}
                    spacing={{ base: 4, md: 6 }}
                    align={{ base: "flex-start", sm: "center" }}
                >
                    <Avatar
                        size={{ base: "md", md: "lg" }}
                        name='Gaurav Gupta'
                        src={process.env.PUBLIC_URL + "/images/profile-pic.jpg"}
                    />
                    <Link
                        className='profile-link github'
                        href='https://github.com/GauravGupta035'
                        color='white'
                        style={{ textDecoration: "none" }}
                        isExternal
                    >
                        <HStack spacing={2}>
                            <FaGithub />
                            <Text fontSize={{ base: "sm", md: "md" }}>GitHub</Text>
                            <FiExternalLink />
                        </HStack>
                    </Link>
                    <Link
                        className='profile-link linkedin'
                        href='https://www.linkedin.com/in/gauravgupta035/'
                        color='white'
                        style={{ textDecoration: "none" }}
                        isExternal
                    >
                        <HStack spacing={2}>
                            <FaLinkedin />
                            <Text fontSize={{ base: "sm", md: "md" }}>LinkedIn</Text>
                            <FiExternalLink />
                        </HStack>
                    </Link>
                </Stack>
            </Box>
        </Flex>
    );
};

export default SidePanel;
