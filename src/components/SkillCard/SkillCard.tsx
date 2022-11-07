import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Skill } from "../../model";
import "./SkillCard.css";

interface Props {
	skill: Skill;
}

const SkillCard: React.FC<Props> = ({ skill }) => {
	return (
		<Flex
			className='skill-card'
			w='95%'
			h='100px'
			mb='10px'
			justify='center'
			align='center'
		>
			<Text
				fontSize='26px'
				letterSpacing={2}
				color='gray.400'
				className='skill'
			>
				{skill.name}
			</Text>
		</Flex>
	);
};

export default SkillCard;
