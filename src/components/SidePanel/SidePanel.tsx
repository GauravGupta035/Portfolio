import {
	Heading,
	Link,
	Text,
	Flex,
	Box,
	HStack,
	Avatar,
	Spacer,
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
		>
			<Heading
				as='h2'
				size={{ base: "3xl", xl: "3xl", lg: "2xl", md: "xl" }}
				color='white'
				mb='20px'
				mt='50px'
			>
				Gaurav Gupta
			</Heading>

			<Heading as='h4' size='lg' color='white' mb='20px'>
				Final Year Computer Science Major
			</Heading>

			<Box
				className='introduction'
				width='450px'
				mb={{ base: "80px", xl: "80px", lg: "40px", md: "20px", sm: "20px" }}
			>
				<Text color='gray.400'>
					I am interested in UI/UX design, web and mobile development.
					<br /> In my spare time, I sometimes share my ongoing project progress
					or learnings blog on{" "}
					<span>
						<Link
							href='https://hashnode.com/@Rakurai'
							color='white'
							textDecoration='underline'
							isExternal
						>
							HashNode
						</Link>
					</span>{" "}
					and{" "}
					<span>
						<Link
							href='https://dev.to/gauravgupta'
							color='white'
							textDecoration='underline'
							isExternal
						>
							Dev.to
						</Link>
					</span>
				</Text>
			</Box>

			<Box
				className='contact'
				mt={{ base: "20vh", xl: "20vh", lg: "10vh", md: "5vh", sm: "2vh" }}
			>
				<HStack spacing={6}>
					<Avatar
						size='lg'
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
