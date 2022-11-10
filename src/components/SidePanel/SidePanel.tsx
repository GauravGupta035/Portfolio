import {
	Heading,
	Link,
	Text,
	Flex,
	Box,
	HStack,
	Divider,
	Avatar,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

import "./SidePanel.css";

const SidePanel: React.FC = () => {
	return (
		<Flex justify='center' flexDirection='column' ml='25%'>
			<Heading as='h2' size='3xl' color='white' mb='20px'>
				Gaurav Gupta
			</Heading>

			<Heading as='h4' size='lg' color='white' mb='20px'>
				Final Year Computer Science Major
			</Heading>

			<Box className='introduction' width='450px' mb='80px'>
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
			<Box className='navigation' mb='80px'>
				<Link
					color='white'
					style={{ textDecoration: "none" }}
					className='nav-link'
					width='200px'
				>
					<HStack mb='20px' className='link'>
						<Text>01</Text>
						<Divider color='white' width='100px' />
						<Text className='section-name'>PROJECTS</Text>
					</HStack>
				</Link>
				<Link
					color='white'
					style={{ textDecoration: "none" }}
					className='nav-link'
				>
					<HStack mb='20px' className='link'>
						<Text>02</Text>
						<Divider color='white' width='100px' />
						<Text className='section-name'>SKILLS</Text>
					</HStack>
				</Link>
				<Link
					color='white'
					style={{ textDecoration: "none" }}
					className='nav-link'
				>
					<HStack mb='50px' className='link'>
						<Text>03</Text>
						<Divider color='white' width='100px' />
						<Text className='section-name'>RESUME</Text>
					</HStack>
				</Link>
			</Box>

			<Box className='contact'>
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
