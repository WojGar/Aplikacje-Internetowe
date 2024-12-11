<?php
/** @var $comment ?\App\Model\Comment */
?>

<div class="form-group">
    <label for="author">Author</label>
    <input type="text" id="author" name="comment[author]" value="<?= $comment ? $comment->getAuthor() : '' ?>">
</div>

<div class="form-group">
    <label for="text">Text</label>
    <textarea id="text" name="comment[text]"><?= $comment ? $comment->getText() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>