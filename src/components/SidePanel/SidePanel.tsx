import {
  Heading,
  Link,
  Text,
  Flex,
  Box,
  HStack,
  Avatar,
  VStack,
  Button,
  Icon,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaDownload } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import "./SidePanel.css";

const SidePanel: React.FC = () => {
  return (
    <Flex
      direction="column"
      px={{ base: "6", md: "8", lg: "10%", xl: "15%" }}
      py={{ base: "10", md: "12" }}
      h={{ base: "auto", lg: "100vh" }}
      w="100%"
      className="side-panel"
      justifyContent="space-between"
    >
      
      <Box>
        
        <Avatar
          size={{ base: "xl", md: "2xl" }}
          name="Gaurav Gupta"
          src={process.env.PUBLIC_URL + "/images/profile-pic.jpg"}
          mb={{ base: "6", md: "8" }}
          border="3px solid"
          borderColor="#48bb78"
        />

        <Heading
          as="h1"
          size={{ base: "xl", md: "2xl" }}
          color="white"
          mb={{ base: "2", md: "3" }}
          fontWeight="bold"
        >
          Gaurav Alok Gupta
        </Heading>

        <Heading
          as="h2"
          size={{ base: "sm", md: "md" }}
          color="#48bb78"
          mb={{ base: "3", md: "4" }}
          fontWeight="semibold"
        >
          Software Engineer
        </Heading>

        <Text
          color="gray.400"
          fontSize={{ base: "sm", md: "md" }}
          mb={{ base: "4", md: "5" }}
        >
          MSc Computer Science
          <br />
          <Text as="span" color="gray.500" fontSize="sm">
            University of St Andrews, UK
          </Text>
        </Text>

        <HStack spacing={2} mb={{ base: "6", md: "8" }} color="gray.500">
          <Icon as={FaMapMarkerAlt} />
          <Text fontSize={{ base: "xs", md: "sm" }}>St Andrews, Scotland</Text>
        </HStack>

        <Box maxW="450px" w="100%" mb={{ base: "6", md: "8" }}>
          <Text color="gray.400" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">
            I'm a Software Engineer with 2+ years of experience building distributed 
            systems and cloud-native applications on AWS and OCI.
          </Text>
        </Box>

        {/* Download Resume Button */}
        <Button
          as="a"
          href={process.env.PUBLIC_URL + "/Gaurav_Alok_Gupta_Resume.pdf"}
          download
          leftIcon={<FaDownload />}
          colorScheme="green"
          variant="solid"
          size={{ base: "md", md: "lg" }}
          w="full"
          maxW="300px"
          mb={{ base: "8", md: "10" }}
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "lg",
          }}
          transition="all 0.2s"
        >
          Download Resume
        </Button>
      </Box>

      {/* Contact Links */}
      <Box className="contact" mt={{ base: "6", md: "10", lg: "auto" }}>
        <VStack spacing={{ base: 3, md: 4 }} align="stretch">
          {/* Email */}
          <Link
            href="mailto:guptagaurav035@gmail.com"
            className="profile-link email"
            color="white"
            style={{ textDecoration: "none" }}
          >
            <HStack spacing={3}>
              <Icon as={FaEnvelope} boxSize={{ base: 4, md: 5 }} />
              <Text fontSize={{ base: "sm", md: "md" }}>guptagaurav035@gmail.com</Text>
            </HStack>
          </Link>

          {/* GitHub */}
          <Link
            className="profile-link github"
            href="https://github.com/GauravGupta035"
            color="white"
            style={{ textDecoration: "none" }}
            isExternal
          >
            <HStack spacing={3}>
              <Icon as={FaGithub} boxSize={{ base: 4, md: 5 }} />
              <Text fontSize={{ base: "sm", md: "md" }}>GitHub</Text>
              <Icon as={FiExternalLink} boxSize={3} />
            </HStack>
          </Link>

          {/* LinkedIn */}
          <Link
            className="profile-link linkedin"
            href="https://www.linkedin.com/in/gauravgupta035/"
            color="white"
            style={{ textDecoration: "none" }}
            isExternal
          >
            <HStack spacing={3}>
              <Icon as={FaLinkedin} boxSize={{ base: 4, md: 5 }} />
              <Text fontSize={{ base: "sm", md: "md" }}>LinkedIn</Text>
              <Icon as={FiExternalLink} boxSize={3} />
            </HStack>
          </Link>
        </VStack>
      </Box>
    </Flex>
  );
};

export default SidePanel;