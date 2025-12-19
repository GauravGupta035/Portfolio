import { Box, Heading, Text, Wrap, WrapItem, Icon } from "@chakra-ui/react";
import { FaCode } from "react-icons/fa";
import { skillCategories } from "../../initialListValues";
import "./SkillsSection.css";

const SkillsSection: React.FC = () => {
  return (
    <Box w="100%" mb={{ base: "12", md: "16" }}>
      <Heading
        as="h2"
        size={{ base: "lg", md: "xl" }}
        color="white"
        mb={{ base: "6", md: "8" }}
        display="flex"
        alignItems="center"
        gap={3}
      >
        <Icon as={FaCode} color="#48bb78" />
        Skills & Technologies
      </Heading>

      <Box>
        {skillCategories.map((category, index) => (
          <Box key={index} mb={{ base: "6", md: "7" }}>
            
            <Text
              color="#48bb78"
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="semibold"
              mb={3}
              letterSpacing="wide"
              textTransform="uppercase"
            >
              {category.category}
            </Text>

            
            <Wrap spacing={{ base: 2, md: 3 }}>
              {category.skills.map((skill: string, idx: number) => (
                <WrapItem key={idx}>
                  <Box
                    className="skill-pill"
                    px={{ base: 3, md: 4 }}
                    py={{ base: 2, md: 2.5 }}
                    borderRadius="full"
                    border="1px solid"
                    borderColor="gray.600"
                    bg="#202022"
                    transition="all 0.2s"
                    _hover={{
                      borderColor: "#48bb78",
                      bg: "rgba(72, 187, 120, 0.1)",
                      boxShadow: "0 4px 12px rgba(72, 187, 120, 0.2)",
                    }}
                    cursor="default"
                  >
                    <Text
                      color="gray.300"
                      fontSize={{ base: "xs", md: "sm" }}
                      fontWeight="medium"
                      whiteSpace="nowrap"
                      className="skill-text"
                    >
                      {skill}
                    </Text>
                  </Box>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SkillsSection;