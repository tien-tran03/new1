import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  shareLink: { projectAlias: string; pageAlias: string };
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ open, onClose, shareLink }) => {
  const shareUrl = `${window.location.origin}/${shareLink.projectAlias}/view/${shareLink.pageAlias}/edit-content`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Đã sao chép liên kết!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Không thể sao chép liên kết!', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            bgcolor: '#ffffff',
            color: '#000000', 
            minWidth: '400px',
            borderRadius: '12px',
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'transparent', 
            },
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}>
          Chia sẻ thiết kế này
          <Typography variant="body2" sx={{ display: 'inline', ml: 1, color: 'gray' }}>
            0 khách truy cập
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
            Người có quyền truy cập
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Thêm thành viên hoặc nhóm"
              variant="outlined"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'gray' }} />,
                sx: {
                  bgcolor: '#f5f5f5',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                },
              }}
            />
            <IconButton sx={{ ml: 1 }}>
              <AddIcon />
            </IconButton>
          </Box>

          <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
            Cấp độ truy cập
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Bắt cứ ai có liên kết...</InputLabel>
              <Select
                defaultValue="view"
                label="Bắt cứ ai có liên kết..."
                sx={{
                  bgcolor: '#f5f5f5',
                  borderRadius: '8px',
                }}
              >
                <MenuItem value="view">Phải có liên kết để truy cập</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Phải có liên kết để truy...</InputLabel>
              <Select
                defaultValue="yes"
                label="Phải có liên kết để truy..."
                sx={{
                  bgcolor: '#f5f5f5',
                  borderRadius: '8px',
                }}
              >
                <MenuItem value="yes">Có thể xem</MenuItem>
                <MenuItem value="no">Có thể chỉnh sửa</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button
            fullWidth
            variant="contained"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyLink}
            sx={{
              bgcolor: '#6f42c1', 
              color: '#ffffff',
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#5a32a3',
              },
            }}
          >
            Sao chép liên kết
          </Button>
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', p: 2, justifyContent: 'space-around' }}>
        
        </DialogActions>
      </Dialog>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" 
      />
    </>
  );
};