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
            w='100%'
            minH='80px'
            mb='3'
            justify='center'
            align='center'
            p={4}
        >
            <Text
                fontSize={{
                    base: "md",
                    sm: "lg",
                    md: "xl",
                    lg: "xl",
                    xl: "2xl",
                }}
                letterSpacing={1}
                color='gray.400'
                className='skill'
                textAlign='center'
            >
                {skill.name}
            </Text>
        </Flex>
    );
};

export default SkillCard;
