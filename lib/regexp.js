extend(RegExp, {
  
  escape: function escape(input) {
    /**
     * Escapes the input text to make it safe for use in a regular expression
     *
     * @since 1.5.3
     * @param input The text to escape
     * @example
     *  RegExp.escape('U$es |()ts +f r*ser^ed keyw()rds.')
     *    // returns 'U\$es \|\(\)ts \+f r\*ser\^ed keyw\(\)rds\.'
     *
     */
    return input.replace(/([/'*+?|()\[\]{}.^$])/g, '\\$1');
  }
});