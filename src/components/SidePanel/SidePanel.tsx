import {
	Heading,
	Link,
	Text,
	Flex,
	Box,
	HStack,
	Avatar,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

import "./SidePanel.css";

const SidePanel: React.FC = () => {
	return (
		<Flex
			direction='column'
			ml={{ base: "25%", xl: "25%", lg: "10%", md: "5%" }}
			h='100%'
			className='side-panel'
		>
			<Heading
				as='h2'
				size={{ base: "3xl", xl: "3xl", lg: "2xl", md: "xl" }}
				color='white'
				mb='20px'
				mt='50px'
			>
				Gaurav Alok Gupta
			</Heading>

			<Heading as='h4' size='lg' color='white' mb='20px'>
				MSc Computer Science Student @ University of St Andrews
			</Heading>

			<Box
				className='introduction'
				width='450px'
				mb={{ base: "80px", xl: "80px", lg: "40px", md: "20px", sm: "20px" }}
			>
				<Text color='gray.400'>
					I am a postgraduate student pursuing MSc in Computer Science with 2 years experience as a Software Development Engineer
					<br /> <br />
					Currently I'm located in St Andrews, UK.
				</Text>
			</Box>

			<Box
				className='contact'
				mt={{ base: "15vh", xl: "15vh", lg: "10vh", md: "5vh", sm: "2vh" }}
			>
				<HStack spacing={{ base: 6, xl: 6, lg: 6, md: 4, sm: 4 }}>
					<Avatar
						size={{ base: "lg", xl: "lg", lg: "lg", md: "md", sm: "md" }}
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
						<HStack>
							<FaGithub />
							<Text>GitHub</Text>
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
						<HStack>
							<FaLinkedin />
							<Text>LinkedIn</Text>
							<FiExternalLink />
						</HStack>
					</Link>
				</HStack>
			</Box>
		</Flex>
	);
};

export default SidePanel;
