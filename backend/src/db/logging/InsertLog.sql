INSERT INTO logs (branch, uuid, type, message, stack)
VALUES (:branch, :uuid, upper(:type), :message, :stack);