import React, { useState } from 'react';
import { Drawer, Box, IconButton } from '@mui/material';
import { X } from 'lucide-react';
// import Settings from "lucide-react";

interface Questions {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  q8: string;
  q9: string;
  q10: string;
}

const CombinedDrawerFormPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Questions>({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
    q8: '',
    q9: '',
    q10: '',
  });

  const questions: Questions = {
    q1: 'What is your name?',
    q2: 'What is your age?',
    q3: 'What is your email?',
    q4: 'Where do you live?',
    q5: 'What is your favorite color?',
    q6: 'What is your hobby?',
    q7: 'What languages do you speak?',
    q8: 'What is your job title?',
    q9: 'What are your strengths?',
    q10: 'What are your weaknesses?',
  };

  const questionKeys = Object.keys(questions) as Array<keyof Questions>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnswers(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const DrawerList = (
    <Box sx={{ width: '90vw', position: 'relative', padding: 2 }}>
      {/* Close Button */}
      <IconButton
        onClick={() => setOpen(false)}
        sx={{ position: 'absolute', top: 8, right: 8 }}
        aria-label="Close drawer"
      >
        <X className="w-8 h-8" />
      </IconButton>

      {/* Form */}
      <form className="space-y-4 mt-12 bg-white shadow rounded p-4 max-w-xl mx-auto">
        {questionKeys.map((key) => (
          <div key={key}>
            <label className="block mb-1">{questions[key]}</label>
            <input
              name={key}
              value={answers[key]}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        ))}
      </form>
    </Box>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="m-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
       Settings 
      </button>
 
      <Drawer
        anchor="left"
        open={open}
        onClose={() => {}}
        ModalProps={{
          keepMounted: true,
          disableEscapeKeyDown: true,
          hideBackdrop: true,
        }}
        variant="temporary"
      >
        {DrawerList}
      </Drawer>
    </>
  );
};

export default CombinedDrawerFormPage;
