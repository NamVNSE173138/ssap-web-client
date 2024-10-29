
const SchoolLogo = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <section>
            <img src={imageUrl} alt="bg_footer" className="h-[120px] rounded-full object-cover w-[120px] " />
        </section>
  )
}

export default SchoolLogo;