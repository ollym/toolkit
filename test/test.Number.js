
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
    
    result((3).odd, true, 'Odd');
    result((2).odd, false, 'Even');
  }

];