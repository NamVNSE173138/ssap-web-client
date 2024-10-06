interface ValidationErrorMessageProps {
    error: string | undefined;
}

const ValidationErrorMessage = ({ error = 'This field is invalid'}: ValidationErrorMessageProps) => {
    return (
        <span className='text-xs text-red-500'>{error}</span>
    );
};

export default ValidationErrorMessage;


// interface ValidationErrorMessageProps {
//     error?: string;
//   }
  
//   const ValidationErrorMessage = ({ error }: ValidationErrorMessageProps) => {
//     if (!error) return null; // Don't render anything if there's no error
  
//     return (
//       <span className='text-xs text-red-500'>
//         {error || 'This field is invalid'}
//       </span>
//     );
//   };
  
//   export default ValidationErrorMessage;
