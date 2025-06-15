
export const isValidJson = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

export const extractWhatsAppText = (corpoTemplate: string): string => {
  try {
    const parsed = JSON.parse(corpoTemplate);
    if (parsed.text?.body) {
      return parsed.text.body;
    } else {
      return corpoTemplate;
    }
  } catch (error) {
    return corpoTemplate;
  }
};

export const createWhatsAppJson = (text: string): string => {
  const whatsAppJson = {
    type: 'text',
    text: {
      body: text
    }
  };
  return JSON.stringify(whatsAppJson, null, 2);
};
