import React, { useState, useEffect } from "react";
import { Form, Button, Card, Col } from "react-bootstrap";
import ChallangeService from "../services/ChallangeService";
import CompanyService from "../services/CompanyService";
import { toast } from "react-toastify";
function CreateChallange(props) {
  const [challangeTitle, setChallangeTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [companies, setCompanies] = useState([]);

  const getCompanyData = async () => {
    const response = await CompanyService.getAllCompanies();
    console.log("res:", response);
    setCompanies(response);
  };

  useEffect(() => {
    getCompanyData();
  }, []);

  const [formValues, setFormValues] = useState([
    { habbitTitle: "", habbitDescription: "" },
  ]);

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([...formValues, { habbitTitle: "", habbitDescription: "" }]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT: ", challangeTitle, companyName, startDate, expiryDate);
    if (
      challangeTitle.length === "" ||
      companyName === "" ||
      startDate === "" ||
      expiryDate === ""
    ) {
      toast.error("No field allowed to leave empty");
      return;
    }

    for (let i = 0; i < formValues.length; i++) {
      if (formValues[i].habbitTitle === "") {
        toast.error("Habbit title is not allowed to leave empty");
        return;
      } else if (formValues[i].habbitTitle.length >= 50) {
        toast.error("Your habit title is too lengthy");
        return;
      } else if (formValues[i].habbitDescription === "") {
        toast.error("Habbit target is not allowed to leave empty");
        return;
      } else if (formValues[i].habbitDescription.length >= 84) {
        toast.error("Your habit target is too lengthy");
        return;
      }
    }

    toast.success("Successfully Created");
    ChallangeService.createChallange({
      challangeTitle,
      companyName,
      startDate,
      expiryDate,
      habbits: formValues,
    })
      .then((res) => {
        // console.log(res.error);
        toast.success("Successfully Created");
        setChallangeTitle("");
        setCompanyName("");
        setStartDate("");
        setExpiryDate("");
        setFormValues([{ habbitTitle: "", habbitDescription: "" }]);
        props.history.push("/challanges");
      })
      .catch((err) => {
        console.log("Error", err.response.data);
        toast.error(err.response.data.error);
      });
  };
  return (
    <>
      <Card className="card card-custom gutter-b example example-compact">
        <Card.Header>
          <Card.Title>
            <h3 className="card-label">Create New Challange</h3>
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Form>
            <div className="row">
              <div className="col-md-5">
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Challange Title</Form.Label>
                  <Form.Control
                    value={challangeTitle}
                    onChange={(e) => setChallangeTitle(e.target.value)}
                    type="text"
                    placeholder="Enter Challange Title"
                  />
                </Form.Group>
              </div>
              <div className="col-md-5">
                <div class="form-group">
                  <label>Company Name</label>
                  <select
                    class="form-control"
                    id="exampleSelect1"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  >
                    <option>Select Company</option>S
                    {companies.map((company) => (
                      <option value={company.companyName}>
                        {company.companyName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-5">
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    name="date"
                    placeholder="date placeholder"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    type="date"
                  />
                </Form.Group>
              </div>
              <div className="col-md-5">
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    name="date"
                    placeholder="date placeholder"
                    value={expiryDate}
                    onChange={(e) => {
                      setExpiryDate(e.target.value);
                    }}
                    type="date"
                  />
                </Form.Group>
              </div>
            </div>

            {/* <div className="col-md-12"> */}
            {formValues.map((element, index) => (
              <div key={index}>
                <hr className="my-3" />
                <div className="row">
                  <div className="col-md-5">
                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Habbit Title({index + 1})</Form.Label>
                      <Form.Control
                        name="habbitTitle"
                        placeholder="Habbit Title"
                        value={element.habbitTitle || ""}
                        onChange={(e) => handleChange(index, e)}
                        type="text"
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-5">
                    <Form.Group controlId="formBasicPassword">
                      <Form.Label> Habbit Target({index + 1})</Form.Label>
                      <Form.Control
                        placeholder="Write a target text here ..."
                        rows="1"
                        type="textarea"
                        name="habbitDescription"
                        value={element.habbitDescription || ""}
                        onChange={(e) => handleChange(index, e)}
                      />
                    </Form.Group>
                  </div>

                  <div className="col-md-2">
                    {index ? (
                      <Button
                        variant="danger"
                        onClick={() => removeFormFields(index)}
                        style={{ marginTop: "1.8rem" }}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
            <div className="col-md-10">
              <Button
                variant="success"
                size="lg"
                block
                onClick={() => addFormFields()}
                style={{ marginBottom: "2rem" }}
              >
                Add Habbit
              </Button>
            </div>
            {/* </div> */}

            <div className="col-md-10">
              <Button
                variant="primary"
                size="lg"
                block
                type="submit"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

export default CreateChallange;
