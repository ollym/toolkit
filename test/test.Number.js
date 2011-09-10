
module.exports = [
  
  function GCD(result) {
    
    result((12).gcd(6, 9), 3, 'Normal');
  },
  
  function LCM(result) {
    
    result((21).lcm(6), 42, 'Normal');
  },
  
  function Round(result) {

    result((1.5).round(), 2, 'API Preservation');
    result((1).round(1).toString(), '1.0', 'Normal');
    result((15).round(-1), '20', 'Normal');
  },
  
  function CHR(result) {
    
    result((72).chr, 'H', 'Getter');
  },
  
  function Even(result) {
    
    result((3).even, false, 'Odd');
    result((2).even, true, 'Even');
  },
  
  function Odd(result) {
    
    result((1).odd, true, 'Odd');
    result((3).odd, true, 'Odd');
    result((4).odd, false, 'Even');
  },
  
  function Radix(result) {
    
    result((127).radix(8, 5), '00177', 'Normal');
  },
  
  function Bin(result) {
    
    result((15).bin(8), '00001111', 'Normal');
  },
  
  function Oct(result) {
    
    result((127).oct(4), '0177', 'Normal');
  },
  
  function Dec(result) {
    
    result((80).dec(4), '0080', 'Normal');
  },
  
  function Hexl(result) {
    
    result((1023).hexl(), '3ff', 'Normal');
  },
  
  function Hex(result) {
    
    result((1023).hex(), '3FF', 'Normal');
  },
  
  function Abbr(result) {
    
    result((1024).abbr(), '1k', 'Normal');
    result((999).abbr(), '999', 'No division');
    result((1e26).abbr(), '100Y', 'Insufficient devision');
    result((1050).abbr(3), '1.050k', '3-digit decimal precision.');
    result((1024).abbr(3, true), '1.000k', 'Binary abbreviation.');
  }
  
];