import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
const UcmStep = () => {
  return (
    <Card className="">
      <CardContent>
        <div className=" grid grid-cols-6 gap-4 my-5 ">
        <div className="col-span-6">
            <h2 className="text-lg font-semibold">Eligibility Criteria</h2>
          </div>
          <div className="space-y-2 col-span-2 col-end-3">
            <Label htmlFor="university" className="text-md">
              University
              <span className="text-red-500 text-sm"> (*)</span>
            </Label>
            <Select
            //   {...form.register("university")}
            //   options={universities}
            //   onChange={handleUniversityChange}
            //   value={selectedUniversity}
            />
            {/* {form.formState.errors.university && (
                      <span className="text-red-500">
                        {form.formState.errors.university.message}
                      </span>
                    )} */}
          </div>

          <div className="space-y-2 col-span-2 col-end-5">
            <Label htmlFor="certificate" className="text-md">
              Certificates
              <span className="text-red-500 text-sm"> (*)</span>
            </Label>
            <Select
            //   {...form.register("certificate")}
            //   options={certificates}
            //   isMulti
            //   onChange={handleCertificatesChange}
            //   value={selectedCertificates}
            />
            {/* {form.formState.errors.certificate && (
                      <span className="text-red-500">
                        {form.formState.errors.certificate.message}
                      </span>
                    )} */}
          </div>

          <div className="space-y-2 col-span-2 col-end-7">
            <Label htmlFor="major" className="text-md">
              Major
              <span className="text-red-500 text-sm"> (*)</span>
            </Label>
            <Select
            //   {...form.register("major")}
            //   options={majors}
            //   onChange={handleMajorChange}
            //   value={selectedMajor}
            />
            {/* {form.formState.errors.major && (
                      <span className="text-red-500">
                        {form.formState.errors.major.message}
                      </span>
                    )} */}
          </div>
          <div className="space-y-2 col-span-3">
            <Label htmlFor="gpa" className="text-md">
              Minimum GPA
            </Label>
            <Input id="gpa" type="number" step="0.1" min="0" max="4" placeholder="e.g., 3.0" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UcmStep;
