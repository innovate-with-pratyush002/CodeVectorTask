function toBase64(value) {
  return Buffer.from(value, "utf-8").toString("base64url");
}

function fromBase64(value) {
  return Buffer.from(value, "base64url").toString("utf-8");
}

export function encodeCursor(product) {
  return toBase64(
    JSON.stringify({
      createdAt: product.createdAt,
      id: product.id
    })
  );
}

export function decodeCursor(cursor) {
  try {
    const parsedValue = JSON.parse(fromBase64(cursor));

    if (!parsedValue.createdAt || !parsedValue.id) {
      throw new Error("Cursor is missing required values.");
    }

    return {
      createdAt: new Date(parsedValue.createdAt),
      id: parsedValue.id
    };
  } catch (error) {
    const invalidCursorError = new Error("Invalid cursor value.");
    invalidCursorError.statusCode = 400;
    throw invalidCursorError;
  }
}
