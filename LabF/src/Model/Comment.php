<?php
namespace App\Model;

use App\Service\Config;

class Comment
{
    private ?int $id = null;
    private ?string $author = null;
    private ?string $text = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Comment
    {
        $this->id = $id;

        return $this;
    }

    public function getAuthor(): ?string
    {
        return $this->author;
    }

    public function setAuthor(?string $author): Comment
    {
        $this->author = $author;

        return $this;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(?string $text): Comment
    {
        $this->text = $text;

        return $this;
    }

    public static function fromArray($array): Comment
    {
        $comment = new self();
        $comment->fill($array);

        return $comment;
    }

    public function fill($array): Comment
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['author'])) {
            $this->setAuthor($array['author']);
        }
        if (isset($array['text'])) {
            $this->setText($array['text']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM comment';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $comments = [];
        $commentsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($commentsArray as $commentArray) {
            $comments[] = self::fromArray($commentArray);
        }

        return $comments;
    }

    public static function find($id): ?Comment
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM comment WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $commentArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $commentArray) {
            return null;
        }
        $comment = Comment::fromArray($commentArray);

        return $comment;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO comment (author, text) VALUES (:author, :text)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'author' => $this->getAuthor(),
                'text' => $this->getText(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE comment SET author = :author, text = :text WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':author' => $this->getAuthor(),
                ':text' => $this->getText(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM comment WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setAuthor(null);
        $this->setText(null);
    }
}