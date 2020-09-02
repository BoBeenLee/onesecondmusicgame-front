import React from "react";
import { TextProps } from "react-native";
import { findAll } from "highlight-words-core";
import _ from "lodash";

interface IProps extends TextProps {
  style?: TextProps["style"];
  autoEscape?: boolean;
  DefaultComponent: React.ElementType<TextProps>;
  HighlightComponent: React.ElementType<TextProps>;
  searchWords: string[];
  textToHighlight: string;
  sanitize?: (text: string) => string;
}

/**
 * Highlights all occurrences of search terms (searchText) within a string (textToHighlight).
 * This function returns an array of strings and <Text> elements (wrapping highlighted words).
 */
export default function HighlighterText({
  autoEscape,
  DefaultComponent,
  HighlightComponent,
  textToHighlight,
  searchWords,
  sanitize,
  style,
  ...props
}: IProps) {
  const chunks = findAll({
    autoEscape,
    sanitize,
    searchWords,
    textToHighlight
  });

  return (
    <DefaultComponent style={style} {...props}>
      {chunks.map((chunk: any, index: number) => {
        const text = textToHighlight.substr(
          chunk.start,
          chunk.end - chunk.start
        );
        return !chunk.highlight ? (
          text
        ) : (
          <HighlightComponent key={index}>{text}</HighlightComponent>
        );
      })}
    </DefaultComponent>
  );
}
