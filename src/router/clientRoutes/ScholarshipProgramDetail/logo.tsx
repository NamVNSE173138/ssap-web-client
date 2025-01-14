
const SchoolLogo = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <section>
            <img src={imageUrl} alt="bg_scholarshipLogo" className="h-[100px] lg:h-[120px] bg-white rounded-full object-cover w-[100px] lg:w-[120px] " />
        </section>
  )
}

export default SchoolLogo;